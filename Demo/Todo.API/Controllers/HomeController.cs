using System.ComponentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Todo.Service.Service;
using Todo.API.RequestModel;
using System.IO;
using Todo.Model;
using Todo.API.Function;
using Todo.Service;
namespace Todo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly IRepositoryWrapper _repositoryWrapper;
        public HomeController(IRepositoryWrapper repositoryWrapper) {
            _repositoryWrapper = repositoryWrapper;
        }

        [HttpGet("GetMissionInDay")]
        public async Task<IActionResult> GetMissionInDay ()
        {
            Response<List<RequestHome.Index>> result = new Response<List<RequestHome.Index>>();
            try
            {
                Function.function fc = new function();
                List<RequestHome.Index> data = new List<RequestHome.Index>();
                DateTime Now = DateTime.Now.ToLocalTime();
                List<Job> lstJob = _repositoryWrapper.Job.getAll().ToList();
                List<string> lstTodo = lstJob.Where(x => x.DateFinish >= Now).Select(x => x.NameTodo).Distinct().ToList();
                for(int k = 0; k < lstTodo.Count;  k ++){
                    List<Job> lstJobTodo = lstJob.Where(x => x.NameTodo == lstTodo[k]).ToList();
                    List<RequestHome.JobInsert> dataJob = new List<RequestHome.JobInsert>();
                    for(int i =0; i < lstJobTodo.Count; i++)
                    {
                        var lstfile = await fc.getFile(lstTodo[k],lstJobTodo[i].NameJob);
                        List<RequestHome.FileModel> lst = new List<RequestHome.FileModel>();
                        foreach (var itemFile in lstfile)
                        {
                            RequestHome.FileModel itemModel = new RequestHome.FileModel(){
                                    fileName = itemFile.fileName,
                                    formFiles = itemFile.base64String,
                            };
                            lst.Add(itemModel);
                        }
                        RequestHome.JobInsert item = new RequestHome.JobInsert(){
                            NameJob = lstJobTodo[i].NameJob,
                            ImplementationDate = lstJobTodo[i].ImplementationDate,
                            DateFinish = lstJobTodo[i].DateFinish,
                            Status = lstJobTodo[i].Status,
                            IsImportan = lstJobTodo[i].IsImportan,
                            file = lst
                        };
                        dataJob.Add(item);
                    } 
                    RequestHome.Index dataItem = new RequestHome.Index(){
                        tenDuAn = lstTodo[k],
                        lstDetail = dataJob
                    };
                    data.Add(dataItem);
                }
                result.data = data;
                result.message = "Lấy dữ liệu thành công";
            }
            catch(Exception ex)
            {
                result.message = ex.Message;
            }
            return Ok(result);
        }
        
    }
}