using Abstracciones.Entities;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Abstracciones.Models.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Services
{
    public interface IAlbumServices
    {
        Task<AlbumEntity> AddAlbum(AlbumRequest albumRequest);
        Task EditAlbum(AlbumEditRequest albumEditRequest);
        Task<Guid> AddAlbumMedia(AlbumMediaRequest albumMediaRequest);
        Task<Guid> DeleteAlbum(Guid idAlbum);
        Task<Guid> DeleteAlbumMedia(Guid idAlbum, List<Guid> idMedias);
        Task<IEnumerable<AlbumResponse>> GetAlbums(Guid idUser);
        Task<AlbumMediaResponse?> GetAlbumMedia(Guid idAlbum, int pageIndex, int pageSize);

    }
}
