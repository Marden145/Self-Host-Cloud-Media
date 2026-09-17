using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Services
{
    public interface IUserServices
    {
        Task<string> LoginWithGoogle(string idToken);
    }
}
