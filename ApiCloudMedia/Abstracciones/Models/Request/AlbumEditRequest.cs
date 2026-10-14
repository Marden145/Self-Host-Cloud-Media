using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Models.Request
{
    public class AlbumEditRequest
    {
        public Guid idAlbum { get; set; }   
        public string Name { get; set; }
        public Guid? CoverMediaId { get; set; }
        public Guid idUser { get; set; }
    }
}
