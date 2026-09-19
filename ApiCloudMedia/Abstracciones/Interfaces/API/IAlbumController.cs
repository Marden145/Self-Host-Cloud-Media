using Abstracciones.Entities;
using Abstracciones.Models;
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
        Task<IActionResult> DeleteAlbumMedia(Guid idAlbumMedia);
        Task<IActionResult> GetAlbums();
        Task<IActionResult> GetAlbumMedia(Guid idAlbum);

    }
}
