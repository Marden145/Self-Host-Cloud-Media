using Abstracciones.Entities;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Services
{
    public interface IAlbumServices
    {
        Task<Guid> AddAlbum(AlbumRequest albumRequest);
        Task<Guid> AddAlbumMedia(AlbumMediaRequest albumMediaRequest);
        Task<Guid> DeleteAlbum(Guid idAlbum);
        Task<Guid> DeleteAlbumMedia(Guid idAlbum, Guid idMedia);
        Task<IEnumerable<AlbumEntity>> GetAlbums();
        Task<AlbumMediaResponse?> GetAlbumMedia(Guid idAlbum);

    }
}
