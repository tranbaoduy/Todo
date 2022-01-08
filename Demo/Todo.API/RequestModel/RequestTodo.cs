using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Model;
using Microsoft.AspNetCore.Http;

namespace Todo.API.RequestModel
{
    public class RequestTodo
    {

        public class Index
        {
            public string NameTodo {get;set;}
            public DateTime DateCreate {get;set;}
            public DateTime DateBegin {get;set;}
            public DateTime DateEnd {get;set;}
        }
        public class Insert
        {
            public InformationList InformationList {get;set;}
            public List<JobInsert> lstDetail {get;set;}
        }

        public class JobInsert {
            public string NameTodo { get; set; }
            public string NameJob { get; set; }
            public DateTime ImplementationDate { get; set; }
            public DateTime DateFinish { get; set; }
            public int Status { get; set; }
            public int IsImportan { get; set; }
            public List<FileModel> file {get;set;}
        }

        public class FileModel
        {
            public string fileName {get;set;}
            public string formFiles {get;set;}
        }
    }
}
