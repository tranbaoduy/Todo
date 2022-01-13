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

        public class ResetForgotPassWord
        {
            public string UserName {get;set;}
            public string PassWord {get;set;}
            public string Token {get;set;}
        }

        public class ForgotPassWord
        {
            public string UserName {get;set;}
        }
        [Serializable]
        public class ObjResetPassWprd
        {
            public string UserName {get;set;}
            public DateTime TimeCreate {get;set;}
            public int CodeReset {get;set;}
        }
    }
}