using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Entities
{
    public class AlbumMediaEntity
    {
        public Guid idAlbumMedia { get; set; }
        public Guid idAlbum { get; set; }
        public Guid IdMedia { get; set; }
        public int State { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
