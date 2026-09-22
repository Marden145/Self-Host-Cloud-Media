using Abstracciones.Entities;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.API
{
    public interface IMediaController
    {
        Task<IActionResult> SaveMediaAsync(MediaRequest mediaRequest, CancellationToken cancellationToken);
        Task<IActionResult> GetMedia(int pageIndex, int pageSize);
        Task<IActionResult> DeleteMedia(List<Guid> idMedias);
        Task<IActionResult> SetFavorite(Guid idMedia, SetFavoriteRequest setFavoriteRequest);
        Task<IActionResult> GetFavorites(int pageIndex, int pageSize);
        Task<IActionResult> FilterMedia(MediaFilterRequest filter);
        Task<IActionResult> GetTrash(int pageIndex, int pageSize);
        Task<IActionResult> RecoverMedia(Guid idMedia);
        

    }
}
