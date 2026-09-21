using Abstracciones.Entities;
using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        [HttpGet("Media/{pageIndex}/{pageSize}")]
        public async Task<IActionResult> GetMedia(int pageIndex, int pageSize) 
        {
            Pagination<MediaEntitie> mediaEntity = await _mediaServices.GetMedia(pageIndex, pageSize);
            if(!mediaEntity.Items.Any())
                return NotFound("No media found");
            return Ok(mediaEntity);
        }

        [HttpDelete("{idMedia}")]
        public async Task<IActionResult> DeleteMedia([FromRoute] Guid idMedia)
        {
            if (idMedia == Guid.Empty)
                return BadRequest("Invalid media ID.");
            return Ok(await _mediaServices.DeleteMedia(idMedia));
        }
        [HttpPatch("{idMedia}/favorite")]

        public async Task<IActionResult> SetFavorite([FromRoute] Guid idMedia, [FromBody] SetFavoriteRequest setFavoriteRequest)
        {
            if (idMedia == Guid.Empty)
                return BadRequest("Invalid media ID.");
            var updated = await _mediaServices.SetFavorite(idMedia, setFavoriteRequest.IsFavorite);    
            if (!updated) return NotFound();
            return Ok(updated);
        }
        [HttpGet("favorites/{pageIndex}/{pageSize}")]

        public async Task<IActionResult> GetFavorites(int pageIndex, int pageSize)
        {
            var favorites = await _mediaServices.GetFavorites(pageIndex, pageSize);
            if (!favorites.Items.Any())
                return NotFound("No favorite media found.");
            return Ok(favorites);
        }
        [HttpGet("filterMedia")]

        public async Task<IActionResult> FilterMedia([FromBody]MediaFilterRequest filter)
        {
            if (filter == null)
                return BadRequest("Filter criteria is required.");
            var filteredMedia = await _mediaServices.FilterMedia(filter);
            if (!filteredMedia.Items.Any())
                return NotFound("No media found matching the filter criteria.");
            return Ok(filteredMedia);
        }
        [HttpGet("trash/{pageIndex}/{pageSize}")]

        public async Task<IActionResult> GetTrash(int pageIndex, int pageSize)
        {
            var trash = await _mediaServices.GetTrash(pageIndex, pageSize);
            if (!trash.Items.Any())
                return NotFound("No media in trash.");
            return Ok(trash);
        }
        [HttpPatch("recoverMedia/{idMedia}")]
        public async Task<IActionResult> RecoverMedia(Guid idMedia)
        {
            var recovered = await _mediaServices.RecoverMedia(idMedia);
            if (!recovered)
                return NotFound("Media not found or not in trash.");
            return Ok(recovered);
        }
    }
}
