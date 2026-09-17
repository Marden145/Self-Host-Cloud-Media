using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Entities
{
    public class UserEntity
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; } 
        public string Email { get; set; } 
        public string? Password { get; set; }
        public string? Photo { get; set; }
        public string? Provider { get; set; }

    }
}
