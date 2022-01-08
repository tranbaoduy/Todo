using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Model;
using Microsoft.AspNetCore.Http;

namespace Todo.API.RequestModel
{
    public class RequestNotify
    {
        public class NotifyMessage
        {
            public string Message { get; set; }
        }
    }
}
