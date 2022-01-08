using System.Globalization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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
    public class TodoController : ControllerBase
    {
        private readonly IRepositoryWrapper _repositoryWrapper;
        
        public TodoController(IRepositoryWrapper repositoryWrapper)
        {
            _repositoryWrapper = repositoryWrapper;
          
        }

        [HttpPost("Paging")]
        public async Task<IActionResult> Paging(PageParameter model)
        {
            Response<PageModel<RequestTodo.Index>> result = new Response<PageModel<RequestTodo.Index>>();
            try
            {
                PageModel<InformationList> data = _repositoryWrapper.InformationList.Paging(model,x => x.NameTodo.Contains(model.filter));
                List<Job> lstJob = _repositoryWrapper.Job.FindByCondition(x => data.data.Select(y => y.NameTodo).Contains(x.NameTodo)).ToList();
                List<RequestTodo.Index> lstIndex = new List<RequestTodo.Index>();
                for(int i = 0; i < data.data.Count ; i++){
                    List<Job> lstJobIndex = lstJob.Where(x => x.NameTodo == data.data[i].NameTodo).OrderBy(x => x.Id).ToList();
                    RequestTodo.Index index = new RequestTodo.Index(){
                        NameTodo = data.data[i].NameTodo,
                        DateCreate = data.data[i].DateCreate,
                        DateBegin = lstJobIndex[0].ImplementationDate,
                        DateEnd = lstJobIndex[lstJobIndex.Count - 1].DateFinish
                    };
                    lstIndex.Add(index);
                }
                PageModel<RequestTodo.Index> dataIndex = new PageModel<RequestTodo.Index>(){
                    cout = data.cout,
                    TotalPage = data.TotalPage,
                    data = lstIndex
                };
                result.data = dataIndex;
                result.message = "Lấy dữ liệu thành công.";
            }
            catch(Exception ex)
            {
                result.message = ex.ToString();
            }
            return Ok(result);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(RequestTodo.Insert model)
        {
            Response<string> result = new Response<string>();
            try
            {
                if (model.InformationList == null || model.lstDetail.Count <= 0)
                {
                    return BadRequest();
                }
                // thêm mới Dự án
                _repositoryWrapper.InformationList.Create(model.InformationList);
                // thêm mới công việc và upload file của mỗi công việc
                Function.function fc = new function();
                string path = @"C:\Users\ADMIN\Desktop\New folder (2)\Todo\Demo\Todo.API\fileUpload" ;
                string pathString = System.IO.Path.Combine(path, model.InformationList.NameTodo);
                System.IO.Directory.CreateDirectory(pathString);
                List<Job> lstJob = new List<Job>();
                for(int i = 0; i < model.lstDetail.Count; i++)
                {
                    string pathUpload = System.IO.Path.Combine(pathString, model.lstDetail[i].NameJob);
                    System.IO.Directory.CreateDirectory(pathUpload);
                    fc.uploadFile(model.lstDetail[i].file,pathUpload);
                    Job newItem = new Job() {
                        NameTodo = model.InformationList.NameTodo,
                        NameJob = model.lstDetail[i].NameJob,
                        ImplementationDate =  model.lstDetail[i].ImplementationDate.ToLocalTime(),
                        DateFinish = model.lstDetail[i].DateFinish.ToLocalTime(),
                        IsImportan = model.lstDetail[i].IsImportan,
                        Status = 0,
                    };
                    lstJob.Add(newItem);
                }
                _repositoryWrapper.Job.CreateMany(lstJob);
                _repositoryWrapper.save();
                result.message = model.InformationList.NameTodo;
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            return Ok(result);
        }

        [HttpGet("getLstJob/{NameTodo}")]
        public async Task<IActionResult> getLstJob(string NameTodo)
        {
            Response<RequestTodo.Insert> result = new Response<RequestTodo.Insert>();
            try
            {
                List<RequestTodo.JobInsert> data = new List<RequestTodo.JobInsert>();
                Function.function fc = new function();
                InformationList Parent = _repositoryWrapper.InformationList.FindByCondition(x => x.NameTodo == NameTodo).FirstOrDefault();
                List<Job> lstJob = _repositoryWrapper.Job.FindByCondition(x => x.NameTodo == NameTodo).OrderBy(x => x.ImplementationDate).ToList();
                for(int i = 0; i < lstJob.Count ; i++){
                    //Lấy lst file đính kèm của công việc
                    var lstfile = await fc.getFile(NameTodo,lstJob[i].NameJob);
                    List<RequestTodo.FileModel> lst = new List<RequestTodo.FileModel>();
                    foreach (var itemFile in lstfile)
                    {
                        RequestTodo.FileModel itemModel = new RequestTodo.FileModel(){
                                fileName = itemFile.fileName,
                                formFiles = itemFile.base64String,
                        };
                        lst.Add(itemModel);
                    }
                    //
                    RequestTodo.JobInsert item = new RequestTodo.JobInsert(){
                        NameJob = lstJob[i].NameJob,
                        NameTodo = lstJob[i].NameTodo,
                        ImplementationDate = lstJob[i].ImplementationDate,
                        DateFinish = lstJob[i].DateFinish,
                        Status = lstJob[i].Status,
                        IsImportan = lstJob[i].IsImportan,
                        file = lst
                    };
                    data.Add(item);
                }
                RequestTodo.Insert dataView = new RequestTodo.Insert()
                {
                    InformationList = Parent,
                    lstDetail = data
                };
                result.data = dataView;
                result.message = "Lấy dữ liệu thành công";

            }
            catch(Exception ex)
            {
                result.message = ex.Message.ToString();
            }
            return Ok(result);
        }
        [HttpPost("Update")]
        public async Task<IActionResult> Update(RequestTodo.Insert model)
        {
            Response<string> result = new Response<string>();
            try
            {
                if (model.InformationList == null || model.lstDetail.Count <= 0)
                {
                    return BadRequest();
                }
                //Xóa Folder
                string path = @"C:\Users\ADMIN\Desktop\New folder (2)\Todo\Demo\Todo.API\fileUpload" ;
                string pathString = System.IO.Path.Combine(path, model.InformationList.NameTodo);
                Directory.Delete(pathString, true);               
                //Xử lý list mới
                string pathStringNew = System.IO.Path.Combine(path, model.InformationList.NameTodo);
                System.IO.Directory.CreateDirectory(pathStringNew);
                Function.function fc = new function();
                List<Job> lstJobNew = new List<Job>();
                List<Job> lstJob = _repositoryWrapper.Job.FindByCondition(x => x.NameTodo == model.InformationList.NameTodo).ToList();
                _repositoryWrapper.Job.DeleteMany(lstJob);
                for(int i = 0; i < model.lstDetail.Count; i++)
                {
                    string pathUpload = System.IO.Path.Combine(pathString, model.lstDetail[i].NameJob);
                    System.IO.Directory.CreateDirectory(pathUpload);
                    fc.uploadFile(model.lstDetail[i].file,pathUpload);
                    Job newItem = new Job() {
                        NameTodo = model.InformationList.NameTodo,
                        NameJob = model.lstDetail[i].NameJob,
                        ImplementationDate = model.lstDetail[i].ImplementationDate.ToLocalTime(),
                        DateFinish = model.lstDetail[i].DateFinish.ToLocalTime(),
                        IsImportan = model.lstDetail[i].IsImportan,
                        Status = model.lstDetail[i].Status,
                    };
                    lstJobNew.Add(newItem);
                }
                _repositoryWrapper.Job.CreateMany(lstJobNew);
                _repositoryWrapper.save();
            }
            catch(Exception ex)
            {
                 result.message = ex.Message.ToString();
            }
            return Ok(result);
        }

        [HttpDelete("Delete/{NameTodo}")]
        public async Task<IActionResult> Delete(string NameTodo)
        {
            Response<string> result = new Response<string>();
            try
            {
                if(String.IsNullOrEmpty(NameTodo)){
                    return BadRequest();
                }
                //Xóa Folder
                string path = @"C:\Users\ADMIN\Desktop\New folder (2)\Todo\Demo\Todo.API\fileUpload" ;
                string pathString = System.IO.Path.Combine(path, NameTodo);
                Directory.Delete(pathString, true);  
                //Xóa 
                InformationList Parent = _repositoryWrapper.InformationList.FindByCondition(x => x.NameTodo == NameTodo).FirstOrDefault();
                List<Job> lstJob = _repositoryWrapper.Job.FindByCondition(x => x.NameTodo == NameTodo).ToList();
                _repositoryWrapper.InformationList.Delete(Parent);
                _repositoryWrapper.Job.DeleteMany(lstJob);
                _repositoryWrapper.save();
                result.message = "Xóa thành công";
            }
            catch(Exception ex)
            {
                result.message = ex.Message;
            }
            return Ok(result);
        }
    }
}
