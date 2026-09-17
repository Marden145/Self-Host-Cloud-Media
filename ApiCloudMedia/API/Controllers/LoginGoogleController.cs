using Abstracciones.Interfaces.API;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Google.Apis.Upload;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginGoogleController : Controller, ILoginGoogleController
    {
        private readonly IUserServices _userServices;
        public LoginGoogleController(IUserServices userServices)
        {
            _userServices = userServices;
        }
        [HttpPost("sing-google")]
        public async Task<IActionResult> LoginWithGoogle(
            [FromBody] GoogleLoginRequest request)
        {
            try
            {
                return Ok(await _userServices.LoginWithGoogle(request.IdToken));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }






    }
}
