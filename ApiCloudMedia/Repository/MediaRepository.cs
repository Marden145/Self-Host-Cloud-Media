using Abstracciones.Entities;
using Abstracciones.Interfaces.Repository;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Repository.Utils;
using System;
using System.Collections.Generic;
using System.Text;
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

        public async Task DeleteMedia(List<Guid> idMedias)
        {
            var rowsAffected = await _context.Media
        .Where(m => idMedias.Contains(m.Id) && m.state == 1)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(m => m.state, 0)
            .SetProperty(m => m.DeletedAt, DateTimeOffset.UtcNow));
            if (rowsAffected == 0)
                throw new InvalidOperationException("The specified media does not exist.");
        }

        public async Task<Pagination<MediaEntitie>> FilterMedia(MediaFilterRequest filter)
        {
            IQueryable<MediaEntitie> query = _context.Media.Where(m => m.state == 1);
            query = TypesFilters(filter, query);
            query = query.OrderByDescending(m => m.UploadedAt);
            return await query.ToPaginacionAsync(filter.PageIndex, filter.PageSize);
        }

        private IQueryable<MediaEntitie> TypesFilters(MediaFilterRequest filter, IQueryable<MediaEntitie> query)
        {
            if (filter.AlbumId.HasValue)
            {
                query = query.Where(m => _context.AlbumMedia
                    .Any(am => am.idAlbum == filter.AlbumId.Value
                            && am.IdMedia == m.Id
                            && am.State == 1));
            }
            if (filter.DateFrom.HasValue)
                query = query.Where(m => m.UploadedAt >= filter.DateFrom.Value);

            if (filter.DateTo.HasValue)
                query = query.Where(m => m.UploadedAt <= filter.DateTo.Value);

            if (filter.Type.HasValue)
                query = query.Where(m => m.Type == filter.Type.Value);

            if (filter.IsFavorite.HasValue)
                query = query.Where(m => m.IsFavorite == filter.IsFavorite.Value);

            if (!string.IsNullOrWhiteSpace(filter.SearchText))
                query = query.Where(m => m.OriginalFileName.Contains(filter.SearchText));
            return query;
        }

        public async Task<Pagination<MediaEntitie>> GetFavorites(int pageIndex, int pageSize) => await _context.Media
        .Where(m => m.state == 1 && m.IsFavorite)
        .ToPaginacionAsync(pageIndex, pageSize);

        public async Task<Pagination<MediaEntitie>> GetMedia(int pageIndex, int pageSize) => await _context.Media
                .Where(m => m.state == 1)
                .ToPaginacionAsync(pageIndex, pageSize);

        public async Task<Pagination<MediaEntitie>> GetTrash(int pageIndex, int pageSize)
    => await _context.Media
        .Where(m => m.state == 0 && m.DeletedAt != null)
        .OrderByDescending(m => m.DeletedAt)
        .ToPaginacionAsync(pageIndex, pageSize);

        public async Task<bool> RecoverMedia(Guid idMedia)
        {
            var rowsAffected = await _context.Media
        .Where(m => m.Id == idMedia && m.state == 0)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(m => m.state, 1)
            .SetProperty(m => m.UploadedAt, DateTimeOffset.UtcNow));

            return rowsAffected > 0;
        }

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
