using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Todo.Model
{
    [Table("InformationList")]
    public class InformationList
    {
        [Key]
        [Column("NameTodo")]
        [StringLength(500)]
        public string NameTodo { get; set; }
        [Column("DateCreate")]
        public DateTime DateCreate { get; set; }
        [Column("Status")]
        public int Status { get; set; }
        //0 là chưa xong , 1 là hoàn thiện
    }
}
