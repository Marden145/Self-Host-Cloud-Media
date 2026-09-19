using Abstracciones.Entities;
using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : Controller, IAlbumController
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

        [HttpDelete("DeleteAlbumMedia/{idAlbum}/{idMedia}")]
        public async Task<IActionResult> DeleteAlbumMedia(Guid idAlbum, Guid idMedia)
        {
            if (idAlbum == Guid.Empty || idMedia == Guid.Empty)
                return BadRequest("Invalid album or media id");
            return Ok(await _albumServices.DeleteAlbumMedia(idAlbum, idMedia));
        }
        [HttpGet("GetAlbumMedia/{idAlbum}")]
        public async Task<IActionResult> GetAlbumMedia(Guid idAlbum)
        {
            if (idAlbum == Guid.Empty)
                return BadRequest("Invalid album id");
            var albumMedia = await _albumServices.GetAlbumMedia(idAlbum);
            if (albumMedia is null)
                return NotFound("Album media not found");
            return Ok(albumMedia);
        }

        [HttpGet("GetAlbums")]
        public async Task<IActionResult> GetAlbums() 
        {
            IEnumerable<AlbumEntity> albumEntity = await _albumServices.GetAlbums();
            if(!albumEntity.Any())
                return NotFound("No albums found");
            return Ok(albumEntity);
        }
    }
}
