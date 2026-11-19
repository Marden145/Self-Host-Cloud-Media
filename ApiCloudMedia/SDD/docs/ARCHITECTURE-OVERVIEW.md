# Visión general de la arquitectura

## Alcance y estado de la información

Este documento describe la arquitectura implementada que se resume en el informe técnico de arquitectura disponible para esta documentación. Las referencias entre paréntesis indican los archivos y, cuando se proporcionaron, los rangos de líneas que sustentan cada descripción. No se afirma aquí una inspección independiente del código ni la ejecución de pruebas.

Se distingue entre:

- **Implementado:** comportamiento o estructura que el informe atribuye al código existente.
- **Riesgo observado/inferido:** una condición del código y su posible consecuencia; no equivale por sí misma a una vulnerabilidad reproducida.
- **No verificado:** información que no pudo confirmarse con la evidencia resumida.

## Resumen

La aplicación es un monolito REST construido con ASP.NET Core 10, Entity Framework Core y SQL Server. La solución (`ApiCloudMedia.slnx`) se organiza en cuatro proyectos principales:

| Proyecto | Responsabilidad |
|---|---|
| `API` | Arranque de la aplicación, configuración, autenticación y autorización HTTP, controladores y publicación de archivos estáticos. |
| `Services` | Lógica de aplicación y coordinación de casos de uso. |
| `Repository` | Persistencia y consultas mediante EF Core, además de paginación. |
| `Abstracciones` | Contratos compartidos, entidades, DTOs, opciones y enumeraciones. |

El flujo predominante es `HTTP → Controller → interfaz de servicio → servicio → interfaz de repositorio → EF Core/SQL Server`. Las dependencias se enlazan mediante el contenedor de ASP.NET Core. No se identifica una capa de dominio independiente: las entidades EF Core están en `Abstracciones` y se usan desde varias capas.

## Proyectos y dependencias

- `API/API.csproj` referencia los proyectos de implementación y reúne las dependencias de la aplicación web.
- `Services/Services.csproj` depende de los contratos compartidos y de las abstracciones de persistencia necesarias para sus casos de uso.
- `Repository/Repository.csproj` usa los contratos compartidos y EF Core.
- `Abstracciones` concentra tipos utilizados por las otras capas y tiene dependencias de ASP.NET Core y paquetes EF, según el informe.

Referencias: `API/API.csproj` (líneas 3–19), `Services/Services.csproj` (11–16), `Repository/Repository.csproj` (10–19). El informe indica que la solución incluye los cuatro proyectos descritos; `API.Tests` contiene artefactos `bin/obj`, pero no se identificó código fuente de pruebas `.cs` visible ni forma parte de la solución analizada.

## Arranque y composición de la aplicación

`API/Program.cs` es el punto de composición. Según la configuración descrita, establece Kestrel con un límite de solicitud de 1 GB, MVC y OpenAPI; configura JWT con validación de emisor, audiencia, vigencia y firma; registra servicios, repositorios y `CloudMediaDbContext` como dependencias `Scoped`; y configura SQL Server, `StorageOptions` y `MediaOptions`.

Los enlaces de interfaces a implementaciones incluyen `IMediaServices → MediaServices`, `IUserServices → UserServices`, `IAlbumServices → AlbumServices` y `IStorageServices → StorageServices`, además de los repositorios correspondientes. También se configura CORS para `http://localhost:5173`, la publicación de archivos físicos bajo `/files`, redirección HTTPS y middleware de autenticación y autorización. (Referencias: `API/Program.cs`, líneas 14–43, 44–51, 53–62 y 65–82).

La configuración de máquina y sensible reside parcialmente en `API/appsettings.json`. El informe señala que allí aparecen una conexión SQL Server local, una ruta física local, configuración JWT y la URL del frontend. Este documento no reproduce valores de configuración ni credenciales.

## Capas y responsabilidades

### API

Los controladores HTTP se encuentran en `API/Controllers` y delegan el trabajo a interfaces de servicios. `MediaController`, `AlbumController` y `StorageController` requieren `[Authorize]`; `LoginGoogleController.LoginWithGoogle` es el acceso público descrito por el informe (`POST /api/LoginGoogle/sing-google`). Referencias: `MediaController.cs` (12–14), `AlbumController.cs` (12–14), `StorageController.cs` (10–12) y `LoginGoogleController.cs` (18–27).

`BaseApiController.CurrentUserId` obtiene el claim `idUsuario` y lo convierte a `Guid` (`BaseApiController.cs`, 6–10). Entre las operaciones expuestas por los controladores están la carga, consulta paginada, filtrado, favoritos, papelera y recuperación de medios; operaciones de álbumes y sus medios; y consulta del uso de almacenamiento. `MediaController` define el filtro como `GET` con `[FromBody]` (`MediaController.cs`, 24–91), un detalle de contrato que conviene tener presente para clientes HTTP.

### Servicios

- `MediaServices` guarda archivos en disco, asigna un GUID, clasifica el MIME, construye `MediaEntitie` y delega la persistencia. También coordina operaciones de favoritos y papelera/recuperación (`Services/MediaServices.cs`, 18–35, 41–69 y 71–99).
- `AlbumServices` crea álbumes y comprueba existencia de álbumes/medios y duplicados (`Services/AlbumServices.cs`, 24–48 y 74–93).
- `UserServices` valida un `idToken` de Google, busca o crea usuarios y genera JWT con claims (`Services/UserServices.cs`, 24–50 y 52–88).
- `StorageServices` convierte tamaños en bytes a GB y calcula disponibilidad (`Services/StorageServices.cs`, 13–34).

### Repositorios y persistencia

Los repositorios reciben `CloudMediaDbContext` y ejecutan operaciones EF Core:

- `MediaRepository` implementa alta, eliminación lógica, favoritos, recuperación, paginación y filtros (`Repository/MediaRepository.cs`, 12–101).
- `AlbumRepository` implementa alta y edición, asociación de medios, eliminación lógica, consultas de portada y paginación (`Repository/AlbumRepository.cs`, 12–112).
- `StorageRepository` suma tamaños por usuario; el informe observa que la consulta no excluye registros eliminados (`Repository/StorageRepository.cs`, 11–15).
- `PaginationQuery.ToPaginacionAsync` calcula el total y las páginas y aplica `Skip`/`Take` (`Repository/Utils/PaginationQuery.cs`, 8–21).

`Repository/Context/CloudMediaDbContext.cs` declara los conjuntos de medios, usuarios, álbumes y relaciones álbum-medio, así como relaciones, restricciones de borrado e índices por `IdUser` (líneas 8–47).

## Modelo de datos y flujo de información

Las entidades están definidas en `Abstracciones/Entities`:

- `MediaEntitie` representa ruta, nombre, tipo MIME, tamaño, categoría, dimensiones, duración, fechas, favorito, estado y propietario (`MediaEntitie.cs`, 8–31).
- `AlbumEntity` representa álbumes (`AlbumEntity.cs`, 8–21).
- `AlbumMediaEntity` representa la asociación entre álbum y medio (`AlbumMediaEntity.cs`, 8–17).
- `UserEntity` representa identidad, proveedor, contraseña y foto (`UserEntity.cs`, 8–19). El informe indica que no se observa uso de la contraseña en el flujo Google.

El flujo habitual de una solicitud es:

1. El controlador recibe la petición HTTP y, para rutas protegidas, obtiene la identidad del claim.
2. El controlador invoca una interfaz `I*Services`.
3. El servicio coordina la operación; en carga de medios, escribe el archivo y prepara la entidad antes de solicitar su persistencia.
4. El servicio invoca una interfaz `I*Repository`.
5. El repositorio consulta o modifica el contexto EF Core, que persiste en SQL Server.

El acceso a archivos y la persistencia relacional son dos recursos distintos; el informe no identifica coordinación transaccional entre ambos.

## Patrones y características del diseño

- **Monolito por capas:** API, servicios, repositorios y tipos compartidos se despliegan como una aplicación organizada en proyectos, no como servicios independientes.
- **Inyección de dependencias e interfaces:** los controladores dependen de interfaces de servicios y los servicios de interfaces de repositorio. Ejemplos: `API/Controllers/MediaController.cs` (14–21), `Services/AlbumServices.cs` (14–22) y `Repository/AlbumRepository.cs` (12–14).
- **Persistencia con EF Core:** el contexto centraliza conjuntos y relaciones de las entidades.
- **Eliminación lógica:** las operaciones de medios y álbumes modifican estado en vez de mostrar un borrado físico en los repositorios descritos. El estado se representa como entero; la convención y sus nombres no son uniformes.
- **Acoplamiento entre persistencia y contrato HTTP:** entidades EF se devuelven o consumen directamente en ciertos flujos, en vez de mantenerse una separación completa mediante DTOs.

## Limitaciones y riesgos de la implementación descrita

Los puntos siguientes son hallazgos del informe de arquitectura; los efectos indicados son riesgos inferidos y no resultados de una prueba de explotación:

1. **Comprobación de propiedad incompleta en algunas operaciones.** El informe identifica operaciones de modificación o consulta por ID que no aplican `IdUser` en la consulta o modificación: favoritos y eliminación/recuperación de medios; edición/eliminación de álbumes; asociaciones y consulta de medios de álbum. También describe validaciones cruzadas incompletas entre álbumes y medios. Referencias: `Repository/MediaRepository.cs` (30, 88–99), `Repository/AlbumRepository.cs` (32–62, 64–105) y `Services/AlbumServices.cs` (74–93). Esto puede permitir operar sobre recursos ajenos si no existe otra comprobación efectiva en el flujo.
2. **Archivos estáticos y middleware de autenticación.** En `API/Program.cs` el middleware `UseStaticFiles` aparece antes de `UseAuthentication` y `UseAuthorization` (65–82). Esto sugiere que las solicitudes de `/files` podrían servirse sin las comprobaciones JWT/propiedad de los controladores; el comportamiento exacto debe confirmarse en el entorno y configuración de despliegue.
3. **Escritura de archivo y base de datos no coordinadas.** `MediaServices` escribe el archivo antes de insertar la fila y el informe no identifica una compensación ante fallo de persistencia (`Services/MediaServices.cs`, 18–35). Por ello, un fallo entre ambas operaciones podría dejar el archivo y el registro en estados inconsistentes.
4. **Eliminación lógica y cómputo de almacenamiento.** No se observa borrado físico en las operaciones descritas, y el cálculo de almacenamiento no excluye medios eliminados (`Repository/MediaRepository.cs`, 26–36; `Repository/AlbumRepository.cs`, 32–62; `Repository/StorageRepository.cs`, 15). El total puede incluir elementos en papelera.
5. **Manejo de errores no centralizado identificado.** El informe no observa middleware global de excepciones o `ProblemDetails`; menciona excepciones como `InvalidOperationException` y `ArgumentNullException` en servicios. No se verifica aquí cómo las transforma el host en respuestas HTTP.
6. **Paginación sin validación central.** `PaginationQuery.ToPaginacionAsync` aplica `Skip`/`Take` sin validación ni topes descritos para `pageIndex` y `pageSize` (`Repository/Utils/PaginationQuery.cs`, 8–21).
7. **Estados y nombres inconsistentes.** Se usan estados enteros en lugar de un enum común y se observan variaciones de nombres como `IdUser`/`idUser` y `State`/`state`. El informe también señala que `GetTotalFileSizeBytes` retorna GB, además de respuestas en español y nombres de estilo desigual.
8. **Contrato de filtro no habitual.** `FilterMedia` usa `GET` con cuerpo (`API/Controllers/MediaController.cs`); el soporte de cuerpos en GET puede variar entre clientes e intermediarios.
9. **Dependencia externa configurada en código.** El informe señala que el ID de cliente de Google está en `Services/UserServices.cs` (53–60), en lugar de derivarse únicamente de configuración externa.
10. **Interfaces de controlador aparentemente no utilizadas.** Se mencionan interfaces `I*Controller` en `Abstracciones` que no parecen ser consumidas por ASP.NET Core; su uso no está confirmado.

## Pruebas y verificación

La evidencia disponible describe artefactos compilados `bin/obj` bajo `API.Tests`, pero no código fuente `.cs` de pruebas visible ni inclusión de ese proyecto en la solución analizada. Por tanto, no se puede afirmar que exista una suite de pruebas verificable, ni que las pruebas se hayan ejecutado o hayan pasado.

## Referencias principales

- Solución y proyectos: `ApiCloudMedia.slnx`, `API/API.csproj`, `Services/Services.csproj`, `Repository/Repository.csproj`.
- Composición y configuración: `API/Program.cs`, `API/appsettings.json`.
- Controladores: `API/Controllers/`.
- Servicios: `Services/MediaServices.cs`, `Services/AlbumServices.cs`, `Services/UserServices.cs`, `Services/StorageServices.cs`.
- Persistencia: `Repository/Context/CloudMediaDbContext.cs`, `Repository/MediaRepository.cs`, `Repository/AlbumRepository.cs`, `Repository/StorageRepository.cs`, `Repository/Utils/PaginationQuery.cs`.
- Tipos compartidos: `Abstracciones/Entities/MediaEntitie.cs`, `AlbumEntity.cs`, `AlbumMediaEntity.cs`, `UserEntity.cs`.