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
        public DbSet<AlbumEntity> Album => Set<AlbumEntity>();
        public DbSet<AlbumMediaEntity> AlbumMedia => Set<AlbumMediaEntity>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AlbumMediaEntity>()
                .HasOne(am => am.Media)
                .WithMany()
                .HasForeignKey(am => am.IdMedia);

            modelBuilder.Entity<AlbumMediaEntity>()
                .HasOne<AlbumEntity>()          
                .WithMany(a => a.AlbumMedia)
                .HasForeignKey(am => am.idAlbum);

            base.OnModelCreating(modelBuilder);
        }

    }
}
