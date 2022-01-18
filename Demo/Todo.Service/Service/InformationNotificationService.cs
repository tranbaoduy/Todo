using Todo.Model;
using Todo.Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Service.RequestModel;

namespace Todo.Service.Service
{
    public interface IInformationNotificationService : IBaseService<InfomationNotification>
    {

    }
    public class InformationNotificationService : BaseService<InfomationNotification>, IInformationNotificationService
    {
        public InformationNotificationService(DbApiContext _context) : base(_context)
        {
            
        }
    }
}
