
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Todo.Service.Service;
using Todo.API.RequestModel;
using Todo.Model;
using Todo.API.Function;

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

        [Authorize]
        [HttpGet("GetMissionInDay")]
        public IActionResult GetMissionInDay()
        {
            Response<List<RequestHome.Index>> result = new Response<List<RequestHome.Index>>();
            try
            {
                var userName = HttpContext.Items["User"];
                Function.function fc = new function();
                List<RequestHome.Index> data = new List<RequestHome.Index>();
                List<InformationList> lstTodo = _repositoryWrapper.InformationList.FindByCondition(x => x.DateCreate >= DateTime.Now).ToList();
                for(int k = 0; k < lstTodo.Count;  k ++){
                    var lstfile = fc.getFile(lstTodo[k].NameTodo + " (" + lstTodo[k].DateCreate.ToString("dd-MM-yyyy") + ")");
                    List<RequestHome.FileModel> datafile = new List<RequestHome.FileModel>();
                    for(int i = 0; i < lstfile.Count;i ++)
                    {
                        RequestHome.FileModel itemfile = new RequestHome.FileModel(){
                            fileName = lstfile[i].fileName,
                            formFiles = lstfile[i].base64String
                        };
                        datafile.Add(itemfile);
                    }
                    RequestHome.Index itemTodo = new RequestHome.Index()
                    {
                        Duan = lstTodo[k],
                        lstFile = datafile

                    };
                    data.Add(itemTodo);
                }
                result.data = data;
                result.message = "L???y d??? li???u th??nh c??ng";
            }
            catch(Exception ex)
            {
                result.message = ex.Message;
            }
            return Ok(result);
        }

        // [HttpPost("CheckFinish")]
        // public async Task<IActionResult> CheckFinish (RequestHome.CheckStatusJob model)
        // {
        //     Response<string> result = new Response<string>();
        //     try
        //     {
        //         if(model == null){
        //             return BadRequest();
        //         }
        //         Job exist = _repositoryWrapper.Job.FindByCondition(x => x.NameJob == model.nameJob && x.NameTodo == model.nameTodo).FirstOrDefault();
        //         if(model.status == true){
        //             exist.Status = 1;
        //             result.message = "C??ng vi???c " + model.nameJob.ToLower() +  " ???? ???????c ho??n th??nh!";
        //         }
        //         else{
        //              exist.Status = 0;
        //         }
        //         _repositoryWrapper.Job.Update(exist);
        //         _repositoryWrapper.save();

                
                

        //     }
        //     catch(Exception ex){
        //         result.message = ex.Message;
        //     }
        //     return Ok(result);
        // }
    }
}
