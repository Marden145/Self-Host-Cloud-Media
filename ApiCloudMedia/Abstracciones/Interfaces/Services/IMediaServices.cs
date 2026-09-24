using Abstracciones.Entities;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.Services
{
    public interface IMediaServices
    {
        Task<Guid> SaveMediaAsync(MediaRequest mediaRequest, CancellationToken cancellationToken);
        Task<Pagination<MediaEntitie>> GetMedia(Guid idUser, int pageIndex, int pageSize);
        Task<List<Guid>> DeleteMedia(List<Guid> idMedias);
        Task<bool> SetFavorite(Guid idMedia, bool isFavorite);
        Task<Pagination<MediaEntitie>> GetFavorites(Guid idUser, int pageIndex, int pageSize);
        Task<Pagination<MediaEntitie>> FilterMedia(Guid idUser, MediaFilterRequest filter);
        Task<Pagination<MediaEntitie>> GetTrash(Guid idUser, int pageIndex, int pageSize);
        Task<bool> RecoverMedia(Guid idMedia);
       
    }
}