using Abstracciones.Entities;
using Abstracciones.Interfaces.Repository;
using Repository.Context;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
namespace Repository
{
    public class AlbumRepository: IAlbumRepository
    {
        private readonly CloudMediaDbContext _context;
        public AlbumRepository(CloudMediaDbContext context) => _context = context;

        public async Task AddAlbum(AlbumEntity albumEntity)
        {
            _context.Album.Add(albumEntity);
            await _context.SaveChangesAsync();
        }

        public async Task AddAlbumMedia(IEnumerable<AlbumMediaEntity> albumMediaEntity)
        {
            _context.AlbumMedia.AddRange(albumMediaEntity);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Guid>> GetExistingMediaIdsAsync(Guid albumId, List<Guid> mediaIds)
        {
            return await _context.AlbumMedia
        .Where(am => am.idAlbum == albumId && mediaIds.Contains(am.IdMedia))
        .Select(am => am.IdMedia)
        .ToListAsync();
        }

        public async Task<bool> AlbumExists(Guid albumId)
        {
            return await _context.Album.AnyAsync(a => a.idAlbum == albumId && a.State == 1);
        }
    }
}
