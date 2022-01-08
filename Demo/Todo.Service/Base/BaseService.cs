using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Todo.Model;

namespace Todo.Service.Base
{
    public interface IBaseService<T> where T : class
    {
        PageModel<T> Paging(PageParameter pagePara, Expression<Func<T, bool>> expression);
        IQueryable<T> getAll();
        IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);
        void Create(T Entity);
        void CreateMany(List<T> Entity);
        void Update(T Entity);
        void Delete(T Entity);
        void DeleteMany(List<T> Entity);
        void Save();
    }    
    public abstract class BaseService<T> : IBaseService<T> where T : class
    {
        private readonly DbApiContext context;
        public BaseService(DbApiContext _context)
        {
            context = _context;
        }
        public DbApiContext dbcontext
        {
            get { return context; }
        }



        public virtual PageModel<T> Paging(PageParameter pagePara, Expression<Func<T, bool>> expression)
        {
            var result = new PageModel<T>();
            result.data = context.Set<T>().AsNoTracking().Where(expression).Skip(pagePara.PageSize*pagePara.Page - pagePara.PageSize).Take(pagePara.PageSize).ToList();
            result.cout = context.Set<T>().AsNoTracking().Count();
            result.TotalPage = result.cout % pagePara.PageSize == 0 ? result.cout / pagePara.PageSize : result.cout / pagePara.PageSize + 1;
            return result;
        }

         public virtual IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        {
            return context.Set<T>().Where(expression);
        }  

        public virtual IQueryable<T> getAll()
        {
            return context.Set<T>().AsNoTracking();
        }
        public virtual void Create(T Entity)
        {
            context.Set<T>().Add(Entity);
        }

        public virtual void Update(T Entity)
        {
            context.Set<T>().Update(Entity);
        }

        public virtual void Delete(T Entity)
        {
            context.Set<T>().Remove(Entity);
        }

         public virtual void CreateMany(List<T> lst)
        {
            context.Set<T>().AddRange(lst);
        }

         public virtual void DeleteMany(List<T> lst)
        {
            context.Set<T>().RemoveRange(lst);
        }


        public void Save()
        {
            context.SaveChanges();
        }


    }
}
