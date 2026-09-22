using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Models.Response
{
    public class StorageResponse
    {
        public double TotalStorageUsed { get; set; }
        public double TotalStorage { get; set; }
        public double TotalStorageAvailable { get; set; }
    }
}
