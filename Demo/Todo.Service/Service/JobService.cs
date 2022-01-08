using Todo.Model;
using Todo.Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Service.RequestModel;

namespace Todo.Service.Service
{
    public interface IJobService : IBaseService<Job>
    {

    }
    public class JobService : BaseService<Job>, IJobService
    {
        public JobService(DbApiContext _context) : base(_context)
        {
            
        }
    }
}
