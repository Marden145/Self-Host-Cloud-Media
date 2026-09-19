using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Abstracciones.Entities
{
    public class AlbumEntity
    {
        [Key]
        public Guid idAlbum{ get; set; }
        public string Name { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int State { get; set; }
        public Guid? CoverMediaId { get; set; }
        public ICollection<AlbumMediaEntity> AlbumMedia { get; set; } = new List<AlbumMediaEntity>();

    }
}
