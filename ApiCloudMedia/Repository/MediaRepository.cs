using Abstracciones.Entities;
using Abstracciones.Interfaces.Repository;
using Abstracciones.Models;
using Repository.Context;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
namespace Repository
{
    public class MediaRepository: IMediaRepository
    {
        private readonly CloudMediaDbContext _context;
        public MediaRepository(CloudMediaDbContext context) => _context = context;

        public async Task AddMedia(MediaEntitie mediaEntity)
        {
            _context.Media.Add(mediaEntity);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CountByIdsAsync(List<Guid> mediaIds) => await _context.Media.CountAsync(m => mediaIds.Contains(m.Id) && m.state == 1);

        public async Task DeleteMedia(Guid idMedia)
        {
            var rowsAffected = await _context.Media
        .Where(m => m.Id == idMedia)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(m => m.state, 0));
            if (rowsAffected == 0)
                throw new InvalidOperationException("The specified media does not exist.");
        }

        public async Task<IEnumerable<MediaEntitie>> GetFavorites() => await _context.Media
        .Where(m => m.state == 1 && m.IsFavorite)
        .ToListAsync();

        public async Task<IEnumerable<MediaEntitie>> GetMedia() => await _context.Media
                .Where(m => m.state == 1)
                .ToListAsync();

        public async Task<bool> SetFavorite(Guid idMedia, bool isFavorite)
        {
            var rowsAffected = await _context.Media
        .Where(m => m.Id == idMedia && m.state == 1)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(m => m.IsFavorite, isFavorite));
            return rowsAffected > 0;
        }
    }
}
