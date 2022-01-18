using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.Service.Service;
using Todo.Model;

namespace Todo.API.ActionFillter
{
    public class TodoFillter : IActionFilter
    {
        private IMemoryCache _cache;
         private readonly IRepositoryWrapper _repositoryWrapper;
        public TodoFillter(IMemoryCache cache, IRepositoryWrapper repositoryWrapper)
        {
            _cache = cache;
            _repositoryWrapper = repositoryWrapper;
        }
        public void OnActionExecuting(ActionExecutingContext context)
        {
           
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.HttpContext.Request.Path.Value.Contains("/api/Todo/Insert") || context.HttpContext.Request.Path.Value.Contains("/api/Todo/Update") || context.HttpContext.Request.Path.Value.Contains("/api/Todo/Delete"))
            {
               List<InformationList> lst = _repositoryWrapper.InformationList.FindByCondition(x => x.DateCreate >= DateTime.Now).ToList();
               _cache.Set<List<InformationList>>("lstNotification", lst);
            }
           
        }
    }
}
