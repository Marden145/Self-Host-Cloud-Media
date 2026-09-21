using Abstracciones.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Abstracciones.Entities
{
    public class MediaEntitie
    {
        [Key]
        public Guid Id { get; set; }
        public string StoragePath { get; set; }
        public string OriginalFileName { get; set; }
        public string ContentType { get; set; }
        public long FileSize { get; set; }
        public MediaType Type { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public TimeSpan? Duration { get; set; }
        public DateTimeOffset UploadedAt { get; set; }
        public DateTimeOffset? CapturedAt { get; set; }
        public DateTimeOffset? DeletedAt { get; set; }
        public bool IsFavorite { get; set; } = false;
        public int state { get; set; }
    }
}
