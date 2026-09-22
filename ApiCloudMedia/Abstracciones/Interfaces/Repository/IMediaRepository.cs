using Abstracciones.Entities;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Repository
{
    public interface IMediaRepository
    {
        Task AddMedia(MediaEntitie mediaEntity);
        Task<Pagination<MediaEntitie>> GetMedia(int pageIndex, int pageSize);
        Task<int> CountByIdsAsync(List<Guid> mediaIds);
        Task DeleteMedia(List<Guid> idMedias);
        Task<bool> SetFavorite(Guid idMedia, bool isFavorite);
        Task<Pagination<MediaEntitie>> GetFavorites(int pageIndex, int pageSize);
        Task<Pagination<MediaEntitie>> FilterMedia(MediaFilterRequest filter);
        Task<Pagination<MediaEntitie>> GetTrash(int pageIndex, int pageSize);
        Task<bool> RecoverMedia(Guid idMedia);

    }
}
