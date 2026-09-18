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

        public async Task<IActionResult> AddAlbum(AlbumRequest albumRequest)
        {
            if(albumRequest==null)
                return BadRequest("Invalid album request");
            return Ok(await _albumServices.AddAlbum(albumRequest));
        }

        public async Task<IActionResult> AddAlbumMedia(AlbumMediaRequest albumMediaRequest)
        {
            if(albumMediaRequest==null)
                return BadRequest("Invalid album media request");
            return Ok(await _albumServices.AddAlbumMedia(albumMediaRequest));
        }
    }
}
