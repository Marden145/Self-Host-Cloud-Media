using Abstracciones.Entities;
using Abstracciones.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Repository
{
    public interface IAlbumRepository
    {
        Task AddAlbum(AlbumEntity albumEntity);
        Task AddAlbumMedia(IEnumerable<AlbumMediaEntity> albumMediaEntity);
        Task<bool> AlbumExists(Guid albumId);
        Task<List<Guid>> GetExistingMediaIdsAsync(Guid albumId, List<Guid> mediaIds);
        Task DeleteAlbum(Guid idAlbum);
        Task DeleteAlbumMedia(Guid idAlbum, List<Guid> idMedias);
        Task<IEnumerable<AlbumEntity>> GetAlbums();
        Task<AlbumMediaResponse?> GetAlbumMedia(Guid idAlbum, int pageIndex, int pageSize);


    }
}
