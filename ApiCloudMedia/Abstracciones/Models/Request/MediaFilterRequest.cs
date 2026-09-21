using Abstracciones.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Models.Request
{
    public class MediaFilterRequest
    {
        public Guid? AlbumId { get; set; }
        public DateTimeOffset? DateFrom { get; set; }
        public DateTimeOffset? DateTo { get; set; }
        public MediaType? Type { get; set; }
        public bool? IsFavorite { get; set; }
        public string? SearchText { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 30;
    }
}
