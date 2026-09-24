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

        public async Task<long> GetTotalFileSizeBytes(Guid idUser) => await _context.Media.Where(m => m.IdUser == idUser).SumAsync(m => (long?)m.FileSize ) ?? 0;
    }
}
