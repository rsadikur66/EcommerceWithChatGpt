using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary1.Models
{
    public class RegisterModel
    {
        public int Id { get; set; }
        public int UserCode { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MobileNo { get; set; }
        public string RoleCode { get; set; }
        public bool? IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
