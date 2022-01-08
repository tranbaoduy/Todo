using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Todo.Model
{
    [Table("Job")]
    public class Job
    {
        [Key]
        public int Id { get; set; }
        [Column("NameTodo")]
        [StringLength(500)]
        public string NameTodo { get; set; }
        [Column("NameJob")]
        [StringLength(500)]
        public string NameJob { get; set; }
        [Column("ImplementationDate")]
        public DateTime ImplementationDate { get; set; }
        [Column("DateFinish")]
        public DateTime DateFinish { get; set; }
        [Column("Status")]
        public int Status { get; set; }
        [Column("IsImportan")]
        public int IsImportan { get; set; }
    }
}
