using Todo.Model;
using Todo.Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Service.RequestModel;

namespace Todo.Service.Service
{
    public interface IInformationListService : IBaseService<InformationList>
    {

    }
    public class InformationListService : BaseService<InformationList>, IInformationListService
    {
        public InformationListService(DbApiContext _context) : base(_context)
        {
            
        }
    }
}
