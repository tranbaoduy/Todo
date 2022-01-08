using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Model;

namespace Todo.Service.Service
{
    public interface IRepositoryWrapper
    {
        IUserService User { get; }
        IJobService Job {get;}
        IInformationListService InformationList {get;}
        void save();
    }
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private DbApiContext _context;
        private IUserService _User;
        private IJobService _Job;
        private IInformationListService _InformationList;

        public RepositoryWrapper(DbApiContext context)
        {
            _context = context;
        }

          public IInformationListService InformationList
        {
            get
            {
                if (_InformationList == null)
                {
                    _InformationList = new InformationListService(_context);
                }
                return _InformationList;
            }
        }

        public IJobService Job
        {
            get
            {
                if (_Job == null)
                {
                    _Job = new JobService(_context);
                }
                return _Job;
            }
        }
        public IUserService User
        {
            get
            {
                if (_User == null)
                {
                    _User = new UserService(_context);
                }
                return _User;
            }
        }

        public void save()
        {
            _context.SaveChanges();
        }
    }
}
