using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Abstracciones.Models
{
    public class Token
    {
        public bool ValidacionExitosa { get; set; }
        public string AccessToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string? Correo { get; set; }
    }
    public class TokenConfiguracion
    {
        [Required]
        [StringLength(200, MinimumLength = 32)]
        public string Key { get; set; }

        [Required]
        public string Issuer { get; set; }

        [Required]
        public string Audience { get; set; }

        [Required]
        public double Expires { get; set; } // en minutos
    }
}
