using Todo.Model;
using Todo.Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Service.RequestModel;

namespace Todo.Service.Service
{
    public interface IUserService : IBaseService<User>
    {
        int Login (UserRequest user);
    }
    public class UserService : BaseService<User>, IUserService
    {
        public UserService(DbApiContext _context) : base(_context)
        {
            
        }

        public int Login(UserRequest user){
            User IsExist = dbcontext.user.FirstOrDefault(x => x.UserName == user.UserName && x.PassWord == user.PassWord);
            if(IsExist != null){
                return 1;
            }
            else{
                return 0;
            }
        }
    }
}
