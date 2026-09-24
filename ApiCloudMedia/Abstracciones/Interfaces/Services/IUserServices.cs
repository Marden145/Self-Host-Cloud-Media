using Abstracciones.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Services
{
    public interface IUserServices
    {
        Task<Token> LoginWithGoogle(string idToken);
    }
}
