using Abstracciones.Entities;
using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : Controller, IMediaController
    {
        private readonly IMediaServices _mediaServices;
        public MediaController(IMediaServices mediaServices)
        {
            _mediaServices = mediaServices;
        }

        [HttpPost]
        public async Task<IActionResult> SaveMediaAsync([FromForm] MediaRequest mediaRequest, CancellationToken cancellationToken)
        {
            if (mediaRequest == null || mediaRequest.File == null)
            {
                return BadRequest("Invalid media request. The file is required.");
            }
            var result = await _mediaServices.SaveMediaAsync(mediaRequest, cancellationToken);
            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetMedia() 
        {
            IEnumerable<MediaEntitie> mediaEntity = await _mediaServices.GetMedia();
            if(!mediaEntity.Any())
                return NotFound("No media found");
            return Ok(mediaEntity);
        }

        [HttpDelete("{idMedia}")]
        public async Task<IActionResult> DeleteMedia(Guid idMedia)
        {
            if (idMedia == Guid.Empty)
                return BadRequest("Invalid media ID.");
            return Ok(await _mediaServices.DeleteMedia(idMedia));
        }
    }
}
