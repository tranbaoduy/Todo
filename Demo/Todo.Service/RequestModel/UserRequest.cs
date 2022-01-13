using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Model;


namespace Todo.Service.RequestModel
{
    public class UserRequest
    {
        public string  UserName {get;set;}
        public string PassWord {get;set;}
    }

    public class  UserResponse
    {
        public int Id {get;set;}
        public string UserName {get;set;}
        public string FullName {get;set;}
        public string Email {get;set;}
        public string Token {get;set;}

        public UserResponse(User user,string token)
        {
            Id = user.Id;
            FullName = user.FullName;
            UserName = user.UserName;
            Email = user.Email;
            Token = token;
        }
    }
}