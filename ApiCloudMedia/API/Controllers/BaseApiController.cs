using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    public abstract class BaseApiController : Controller
    {
        protected Guid CurrentUserId =>
            Guid.Parse(User.FindFirstValue("idUsuario")!);
    }
}
