using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Todo.API.RequestModel
{
    public class RequestUser
    {
        public class User
        {
            public string UserName {get;set;}
            public string PassWord {get;set;}
        }
    }
}