using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.API
{
    public interface IStorageController
    {
        Task<IActionResult> GetTotalFileSizeBytes();
    }
}
