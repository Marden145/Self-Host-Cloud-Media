using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Google.Apis.Upload;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StorageController : BaseApiController, IStorageController
    {
        private readonly IStorageServices _storageServices;
        public StorageController(IStorageServices storageServices)
        {
            _storageServices = storageServices;
        }
        [HttpGet("storageAvailable")]
        public async Task<IActionResult> GetTotalFileSizeBytes()
        {
            var response = await _storageServices.GetTotalFileSizeBytes(CurrentUserId);
            if(response==null)
                return NoContent();
            return Ok(response);
        }
    }
}
