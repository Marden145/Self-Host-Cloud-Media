using Abstracciones.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Services
{
    public interface IAlbumServices
    {
        Task<Guid> AddAlbum(AlbumRequest albumRequest);
        Task<Guid> AddAlbumMedia(AlbumMediaRequest albumMediaRequest);

    }
}
