using Abstracciones.Entities;
using Abstracciones.Models;
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
        Task<IEnumerable<MediaEntitie>> GetMedia();
        Task<Guid> DeleteMedia(Guid idMedia);
        Task<bool> SetFavorite(Guid idMedia, bool isFavorite);
        Task<IEnumerable<MediaEntitie>> GetFavorites();
    }
}