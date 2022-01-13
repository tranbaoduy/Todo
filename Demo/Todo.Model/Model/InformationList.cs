using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Todo.Model
{
    [Table("InformationList")]
    public class InformationList
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }
        [Column("GuiId")]
        [StringLength(500)]
        public string GuiId { get; set; }
        [Column("NameTodo")]
        [StringLength(500)]
        public string NameTodo { get; set; }
        [Column("UserName")]
        [StringLength(500)]
        public string UserName { get; set; }
        [Column("DateCreate")]
        public DateTime DateCreate { get; set; }
        [Column("Status")]
        public bool Status { get; set; }
        [Column("Important")]
        public bool Important { get; set; }
        //0 là chưa xong , 1 là hoàn thiện
    }
}
