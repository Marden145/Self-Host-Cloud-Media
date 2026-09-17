using Abstracciones.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository.Context
{
    public class CloudMediaDbContext:DbContext
    {
        public CloudMediaDbContext(DbContextOptions<CloudMediaDbContext> options) : base(options)
        {
        }
        public DbSet<MediaEntitie> Media => Set<MediaEntitie>();
        public DbSet<UserEntity> User => Set<UserEntity>();

    }
}
