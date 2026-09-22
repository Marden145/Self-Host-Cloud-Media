using Abstracciones.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using System;
using System.Collections.Generic;
using System.Text;

namespace Repository
{
    public class StorageRepository: IStorageRepository
    {
        private readonly CloudMediaDbContext _context;
        public StorageRepository(CloudMediaDbContext context) => _context = context;

        public async Task<long> GetTotalFileSizeBytes() => await _context.Media.SumAsync(m => (long?)m.FileSize) ?? 0;
    }
}
