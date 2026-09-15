using Abstracciones.Models;
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
        Task<IActionResult> GetMedia();

    }
}
