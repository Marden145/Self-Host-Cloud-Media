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
        Task<IActionResult> DeleteAlbumMedia(Guid idAlbum, Guid idMedia);
        Task<IActionResult> GetAlbums();
        Task<IActionResult> GetAlbumMedia(Guid idAlbum);

    }
}
