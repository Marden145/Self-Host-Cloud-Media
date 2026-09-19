using Abstracciones.Entities;
using Abstracciones.Interfaces.Repository;
using Repository.Context;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Abstracciones.Models;
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

        public async Task DeleteAlbum(Guid idAlbum)
        {
            var rowsAffected = await _context.Album
        .Where(a => a.idAlbum == idAlbum)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(a => a.State, 0));

            if (rowsAffected == 0)
                throw new InvalidOperationException("The specified album does not exist.");
        }

        public async Task DeleteAlbumMedia(Guid idAlbum, Guid idMedia)
        {
            var rowsAffected = await _context.AlbumMedia
        .Where(am => am.idAlbum == idAlbum && am.IdMedia == idMedia && am.State == 1)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(am => am.State, 0));

            if (rowsAffected == 0)
                throw new InvalidOperationException("The specified album media does not exist.");
        }

        public async Task<IEnumerable<AlbumEntity>> GetAlbums() => await _context.Album
                .Where(a => a.State == 1)
                .ToListAsync();

        public async Task<AlbumMediaResponse?> GetAlbumMedia(Guid idAlbum)
        {
            return await _context.Album
        .Where(a => a.idAlbum == idAlbum && a.State == 1)
        .Select(a => new AlbumMediaResponse
        {
            IdAlbum = a.idAlbum,
            Name = a.Name,
            CreatedAt = a.CreatedAt,
            CoverMediaId = a.CoverMediaId,
            State = a.State,
            Media = a.AlbumMedia
                .Where(am => am.State == 1 && am.Media.state == 1)
                .Select(am => new MediaResponse
                {
                    Id = am.Media.Id,
                    StoragePath = am.Media.StoragePath,
                    OriginalFileName = am.Media.OriginalFileName,
                    ContentType = am.Media.ContentType,
                    FileSize = am.Media.FileSize,
                    Type = am.Media.Type,
                    Width = am.Media.Width,
                    Height = am.Media.Height,
                    Duration = am.Media.Duration,
                    UploadedAt = am.Media.UploadedAt,
                    CapturedAt = am.Media.CapturedAt,
                    state = am.Media.state
                })
                .ToList()
        })
        .FirstOrDefaultAsync();

        }
    }
}
