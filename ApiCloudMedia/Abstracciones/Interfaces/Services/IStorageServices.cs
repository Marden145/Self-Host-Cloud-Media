using Abstracciones.Models.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Services
{
    public interface IStorageServices
    {
        Task<StorageResponse> GetTotalFileSizeBytes();
    }
}
