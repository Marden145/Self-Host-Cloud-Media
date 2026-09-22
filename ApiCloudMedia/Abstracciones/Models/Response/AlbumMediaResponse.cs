using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Models
{
    public class AlbumMediaResponse
    {
        public Guid IdAlbum { get; set; }
        public string Name { get; set; }
        public DateTime? CreatedAt { get; set; }
        public Guid? CoverMediaId { get; set; }
        public int State { get; set; }
        public Pagination<MediaResponse> Media { get; set; }

    }
}
