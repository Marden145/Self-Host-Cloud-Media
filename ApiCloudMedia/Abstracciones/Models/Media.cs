using System;
using Microsoft.AspNetCore.Http;

namespace Abstracciones.Models
{
    public enum MediaType
    {
        Image,
        Video,
        Audio,
        Document,
        Other
    }
    public class MediaBase
    {
        public string OriginalFileName { get; set; } 
        public string ContentType { get; set; } 
        public long FileSize { get; set; }
        public MediaType Type { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public TimeSpan? Duration { get; set; }
        public DateTimeOffset UploadedAt { get; set; }
        public DateTimeOffset? CapturedAt { get; set; }
        public int state { get; set; }
    }

    public class MediaResponse : MediaBase
    {
        public Guid Id { get; set; }
        public string StoragePath { get; set; } 
    }
    public class MediaRequest
    {
        public IFormFile File { get; set; }
    }

}
