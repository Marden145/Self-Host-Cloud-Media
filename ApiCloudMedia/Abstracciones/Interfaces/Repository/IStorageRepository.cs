using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Repository
{
    public interface IStorageRepository
    {
        Task<long> GetTotalFileSizeBytes();
    }
}
