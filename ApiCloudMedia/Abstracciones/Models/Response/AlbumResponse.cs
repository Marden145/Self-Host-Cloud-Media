using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Models.Response
{
    public class AlbumResponse
    {
        public Guid idAlbum { get; set; }
        public string Name { get; set; }
        public int State { get; set; }
        public string coverAlbumUrl { get; set; }
    }
}
