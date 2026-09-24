using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Abstracciones.Entities
{
    public class UserEntity
    {
        [Key]
        public Guid IdUser { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; } 
        public string Email { get; set; } 
        public string? Password { get; set; }
        public string? Photo { get; set; }
        public string? Provider { get; set; }

    }
}
