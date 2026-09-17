using Abstracciones.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Repository
{
    public interface IUserRepository
    {
        Task<UserEntity?> GetUserByEmail(string email);
        Task CreateUserAsync(UserEntity user);

    }
}
