using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Todo.Model
{
    [Table("InfomationNotification")]
    public class InfomationNotification
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }
        [Column("UserName")]
        [StringLength(500)]
        public string UserName { get; set; }
        [Column("Endpoint")]
        [StringLength(500)]
        public string Endpoint { get; set; }
        [Column("p256dh")]
        [StringLength(500)]
        public string p256dh { get; set; }
        [Column("auth")]
        [StringLength(500)]
        public string auth { get; set; }
    }
}
