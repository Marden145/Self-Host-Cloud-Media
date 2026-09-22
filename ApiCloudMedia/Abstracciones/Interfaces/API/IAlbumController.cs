using Abstracciones.Entities;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.API
{
    public interface IAlbumController
    {
        Task<IActionResult> AddAlbum(AlbumRequest albumRequest);
        Task<IActionResult> AddAlbumMedia(AlbumMediaRequest albumMediaRequest);
        Task<IActionResult> DeleteAlbum(Guid idAlbum);
        Task<IActionResult> DeleteAlbumMedia(Guid idAlbum, List<Guid> idMedias);
        Task<IActionResult> GetAlbums();
        Task<IActionResult> GetAlbumMedia(Guid idAlbum, int pageIndex, int pageSize);

    }
}
