using Abstracciones.Entities;
using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AlbumController : BaseApiController, IAlbumController
    {
        private readonly IAlbumServices _albumServices;
        public AlbumController(IAlbumServices albumServices)
        {
            _albumServices = albumServices;
        }
        [HttpPost("AddAlbum")]
        public async Task<IActionResult> AddAlbum(AlbumRequest albumRequest)
        {
            if(albumRequest==null)
                return BadRequest("Invalid album request");
            return Ok(await _albumServices.AddAlbum(albumRequest));
        }

        [HttpPost("AddAlbumMedia")]
        public async Task<IActionResult> AddAlbumMedia(AlbumMediaRequest albumMediaRequest)
        {
            if(albumMediaRequest==null)
                return BadRequest("Invalid album media request");
            return Ok(await _albumServices.AddAlbumMedia(albumMediaRequest));
        }
        [HttpDelete("DeleteAlbum/{idAlbum}")]
        public async Task<IActionResult> DeleteAlbum(Guid idAlbum)
        {
            if(idAlbum == Guid.Empty)
                return BadRequest("Invalid album id");

            return Ok(await _albumServices.DeleteAlbum(idAlbum));
        }

        [HttpDelete("DeleteAlbumMedia/{idAlbum}")]
        public async Task<IActionResult> DeleteAlbumMedia(Guid idAlbum, [FromBody] List<Guid> idMedias)
        {
            if (idAlbum == Guid.Empty || idMedias == null || idMedias.Count == 0)
                return BadRequest("Invalid album or media id");
            return Ok(await _albumServices.DeleteAlbumMedia(idAlbum, idMedias));
        }
        [HttpGet("GetAlbumMedia/{idAlbum}/{pageIndex}/{pageSize}")]
        public async Task<IActionResult> GetAlbumMedia(Guid idAlbum, int pageIndex, int pageSize)
        {
            if (idAlbum == Guid.Empty)
                return BadRequest("Invalid album id");
            var albumMedia = await _albumServices.GetAlbumMedia(idAlbum, pageIndex, pageSize);
            if (albumMedia is null)
                return NotFound("Album media not found");
            return Ok(albumMedia);
        }

        [HttpGet("GetAlbums")]
        public async Task<IActionResult> GetAlbums() 
        {
            IEnumerable<AlbumEntity> albumEntity = await _albumServices.GetAlbums(CurrentUserId);
            if(!albumEntity.Any())
                return NotFound("No albums found");
            return Ok(albumEntity);
        }
    }
}
