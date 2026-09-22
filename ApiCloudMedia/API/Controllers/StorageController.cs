using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Google.Apis.Upload;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : Controller, IStorageController
    {
        private readonly IStorageServices _storageServices;
        public StorageController(IStorageServices storageServices)
        {
            _storageServices = storageServices;
        }
        [HttpGet("storageAvailable")]
        public async Task<IActionResult> GetTotalFileSizeBytes()
        {
            var response = await _storageServices.GetTotalFileSizeBytes();
            if(response==null)
                return NoContent();
            return Ok(response);
        }
    }
}
