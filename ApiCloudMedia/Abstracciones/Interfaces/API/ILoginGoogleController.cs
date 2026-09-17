using Abstracciones.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.API
{
    public interface ILoginGoogleController
    {
        Task<IActionResult> LoginWithGoogle( GoogleLoginRequest request);
    }
}
