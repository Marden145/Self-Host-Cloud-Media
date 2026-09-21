using Abstracciones.Models;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Repository.Utils
{
    public static class PaginationQuery
    {
        public static async Task<Pagination<T>> ToPaginacionAsync<T>(
        this IQueryable<T> query, int pageIndex, int pageSize)
        {
            var totalRegistros = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRegistros / (double)pageSize);

            var items = await query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new Pagination<T>(items, pageIndex, totalPages);
        }

    }
}
