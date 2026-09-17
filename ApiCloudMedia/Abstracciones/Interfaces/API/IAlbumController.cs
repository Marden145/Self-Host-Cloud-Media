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
    }
}
