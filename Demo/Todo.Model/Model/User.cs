using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Todo.Model
{
    [Table("User")]
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Column("UserName")]
        [StringLength(100)]
        public string UserName { get; set; }
        [Column("FullName")]
        [StringLength(500)]
        public string FullName { get; set; }
        [Column("PassWord")]
        [StringLength(100)]
        public string PassWord { get; set; }
        public int role { get; set; }
        [Column("Email")]
        [StringLength(150)]
        public string Email { get; set; }
    }
}
