using Abstracciones.Interfaces.Repository;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models.Options;
using Abstracciones.Models.Response;
using Microsoft.Extensions.Options;
using Repository;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{
    public class StorageServices: IStorageServices
    {
        private const double BytesPerGB = 1024 * 1024 * 1024;
        private readonly StorageOptions _options;
        private readonly IStorageRepository _storageRepository;
        public StorageServices(IStorageRepository storageRepository, IOptions<StorageOptions> options)
        {
            _options = options.Value;
            _storageRepository = storageRepository;
        }

        public async Task<StorageResponse> GetTotalFileSizeBytes()
        {
            var usedBytes = await _storageRepository.GetTotalFileSizeBytes();
            var usedGB = usedBytes / BytesPerGB;
            var totalGB = _options.TotalStorageGB;
            return GetStorageResponse(usedGB, totalGB);
        }
        private StorageResponse GetStorageResponse(double usedGB, double totalGB) => new StorageResponse
        {
            TotalStorageUsed = Math.Round(usedGB, 2),
            TotalStorage = totalGB,
            TotalStorageAvailable = Math.Round(Math.Max(0, totalGB - usedGB), 2)
        };
    }
}
