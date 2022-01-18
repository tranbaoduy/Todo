using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Model;
using Microsoft.AspNetCore.Http;

namespace Todo.API.RequestModel
{
    public class RequestPushNotification
    {
        public class Request {
            public string UserName {get;set;}
            public Subscrition subscrition {get;set;}

        }
        public class Subscrition
        {
            public string Endpoint { get; set; }
            public IDictionary<string, string> Keys { get; set; }
            // public string  endpoint {get;set;}
            // public string auth {get;set;}
            // public string p256dh  {get;set;}
        }

        public class Sub
        {
            public string  endpoint {get;set;}
            public string auth {get;set;}
            public string p256dh  {get;set;}
        }

        public class VAPID
        {
            public string  subject {get;set;}
            public string publicKey {get;set;}
            public string privateKey  {get;set;}
        }
    }
}
