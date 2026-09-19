using Abstracciones.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Repository
{
    public interface IMediaRepository
    {
        Task AddMedia(MediaEntitie mediaEntity);
        Task<IEnumerable<MediaEntitie>> GetMedia();
        Task<int> CountByIdsAsync(List<Guid> mediaIds);
        Task DeleteMedia(Guid idMedia);
        Task<bool> SetFavorite(Guid idMedia, bool isFavorite);
        Task<IEnumerable<MediaEntitie>> GetFavorites();
    }
}
