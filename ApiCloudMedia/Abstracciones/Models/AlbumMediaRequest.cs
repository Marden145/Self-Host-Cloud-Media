using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Models
{
    public class AlbumMediaRequest
    {
        public Guid idAlbum { get; set; }
        public List<Guid> IdMedias { get; set; }
    }
}
