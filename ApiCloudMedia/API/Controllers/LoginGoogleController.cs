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
    public class LoginGoogleController : Controller, ILoginGoogleController
    {
        private readonly IUserServices _userServices;
        public LoginGoogleController(IUserServices userServices)
        {
            _userServices = userServices;
        }
        [HttpPost("sing-google")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginRequest request)
        {
            var token = await _userServices.LoginWithGoogle(request.IdToken);
            if (!token.ValidacionExitosa)
                return Unauthorized(new { message = "Token de Google inválido." });
            return Ok(token);
        }
    }
}
