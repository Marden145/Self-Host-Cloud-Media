using Abstracciones.Entities;
using Abstracciones.Interfaces.Repository;
using Repository.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly CloudMediaDbContext _context;
        public UserRepository(CloudMediaDbContext context)
        {
            _context = context;
        }
        public async Task CreateUserAsync(UserEntity user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<UserEntity?> GetUserByEmail(string email)
        {
            return await _context.User.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
