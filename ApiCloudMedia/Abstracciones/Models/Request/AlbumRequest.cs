using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Models
{
    public class AlbumRequest
    {
        public string Name { get; set; }
        public Guid? CoverMediaId { get; set; }

    }
}
