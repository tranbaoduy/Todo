using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Model;
using Microsoft.AspNetCore.Http;

namespace Todo.API.RequestModel
{
    public class RequestHome
    {
        public class Index
        {
            public InformationList Duan {get;set;}
            public List<FileModel> lstFile {get;set;}
        }



        public class FileModel
        {
            public string fileName {get;set;}
            public string formFiles {get;set;}
        }

        public class CheckStatusJob
        {
            public string nameTodo {get;set;}
            public string nameJob {get;set;}
            public bool status {get;set;}
        }
       
    }
}
