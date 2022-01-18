using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Todo.Service.Service;
using Todo.API.RequestModel;
using System.IO;
using Todo.Model;
using Todo.API.Function;
using Todo.Service;
using Todo.Service.RequestModel;
using Microsoft.AspNetCore.JsonPatch;
using Todo.API.ActionFillter;

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

        [Authorize]
        [HttpPost("Paging")]
        public IActionResult Paging(PageParameter model)
        {
            Response<PageModel<RequestTodo.Index>> result = new Response<PageModel<RequestTodo.Index>>();
            try
            {
                var user = (UserResponse)HttpContext.Items["User"];
                PageModel<InformationList> data = _repositoryWrapper.InformationList.Paging(model,x => x.NameTodo.Contains(model.filter) && x.UserName == user.UserName);
                List<RequestTodo.Index> lstIndex = new List<RequestTodo.Index>();
                for(int i = 0; i < data.data.Count ; i++){
                    RequestTodo.Index index = new RequestTodo.Index(){
                        Id = data.data[i].GuiId,
                        NameTodo = data.data[i].NameTodo,
                        DateCreate = data.data[i].DateCreate,
                        Status = data.data[i].Status,
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

        [Authorize]
        [ServiceFilter(typeof(TodoFillter))]
        [HttpPost("Insert")]
        public IActionResult Insert(RequestTodo.Insert model)
        {
            Response<string> result = new Response<string>();
            try
            {
                if (model.InformationList == null)
                {
                    return BadRequest();
                }
                // thêm mới Dự án
                model.InformationList.GuiId = Guid.NewGuid().ToString();
                model.InformationList.DateCreate = model.InformationList.DateCreate.ToLocalTime();
                _repositoryWrapper.InformationList.Create(model.InformationList);
                // thêm mới công việc và upload file của mỗi công việc
                Function.function fc = new function();
                string startupPath = System.IO.Directory.GetCurrentDirectory();
                string pathString = System.IO.Path.Combine(startupPath + "\\fileUpload", model.InformationList.NameTodo + " ("+ model.InformationList.DateCreate.ToString("dd-MM-yyyy")+")");
                System.IO.Directory.CreateDirectory(pathString);
                fc.uploadFile(model.file,pathString);
                _repositoryWrapper.InformationList.Create(model.InformationList);
                _repositoryWrapper.save();
                result.message = model.InformationList.NameTodo;
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            return Ok(result);
        }

        [Authorize]
         
        [HttpGet("GetInformationList/{id}")]
        public IActionResult GetInformationList(string id)
        {
            Response<RequestTodo.Insert> result = new Response<RequestTodo.Insert>();
            try
            {
                var user = (UserResponse)HttpContext.Items["User"];
                Function.function fc = new function();
                InformationList Parent = _repositoryWrapper.InformationList.FindByCondition(x => x.GuiId == id && x.UserName == user.UserName).FirstOrDefault();
                var lstfile = fc.getFile(Parent.NameTodo + " (" + Parent.DateCreate.ToString("dd-MM-yyyy") +")");
                List<RequestTodo.FileModel> lst = new List<RequestTodo.FileModel>();
                foreach (var itemFile in lstfile)
                {
                    RequestTodo.FileModel itemModel = new RequestTodo.FileModel(){
                        fileName = itemFile.fileName,
                        formFiles = itemFile.base64String,
                    };
                    lst.Add(itemModel);
                }
                RequestTodo.Insert data = new RequestTodo.Insert()
                {
                    InformationList = Parent,
                    file = lst
                };
                result.data = data;
                result.message = "Lấy dữ liệu thành công";

            }
            catch(Exception ex)
            {
                result.message = ex.Message.ToString();
            }
            return Ok(result);
        }

        [Authorize]
        [ServiceFilter(typeof(TodoFillter))]
        [HttpPut("Update/{id}")]
        public IActionResult Update(string id,RequestTodo.Insert model)
        {
            Response<string> result = new Response<string>();
            try
            {
                if (model.InformationList == null)
                {
                    return BadRequest();
                }
                var user = (UserResponse)HttpContext.Items["User"];
                //model.InformationList.DateCreate = model.InformationList.DateCreate.ToLocalTime();
                InformationList old = _repositoryWrapper.InformationList.FindById(x => x.GuiId == id && x.UserName == user.UserName);
                if(old == null)
                {
                    return BadRequest();
                }
                _repositoryWrapper.InformationList.Update(model.InformationList);
                _repositoryWrapper.save();
                //Xóa Folder
                string startupPath = System.IO.Directory.GetCurrentDirectory();
                string pathString = System.IO.Path.Combine(startupPath + "\\fileUpload", old.NameTodo + " (" + old.DateCreate.ToString("dd-MM-yyyy") +")");
                Directory.Delete(pathString, true);               
                //Xử lý list mới
                Function.function fc = new function();
                string pathStringNew = System.IO.Path.Combine(startupPath + "\\fileUpload", model.InformationList.NameTodo + " (" + model.InformationList.DateCreate.ToString("dd-MM-yyyy") +")");
                System.IO.Directory.CreateDirectory(pathStringNew);
                fc.uploadFile(model.file,pathStringNew);
            }
            catch(Exception ex)
            {
                 result.message = ex.Message.ToString();
            }
            return Ok(result);
        }

        [Authorize]
        [ServiceFilter(typeof(TodoFillter))]
        [HttpDelete("Delete/{IdTodo}")]
        public IActionResult Delete(string IdTodo)
        {
            Response<string> result = new Response<string>();
            try
            {
                if(String.IsNullOrEmpty(IdTodo)){
                    return BadRequest();
                }
                //Xóa 
                InformationList Parent = _repositoryWrapper.InformationList.FindById(x => x.GuiId == IdTodo);
                _repositoryWrapper.InformationList.Delete(Parent);
                _repositoryWrapper.save();
                  //Xóa Folder
                string startupPath = System.IO.Directory.GetCurrentDirectory();
                string pathString = System.IO.Path.Combine(startupPath + "\\fileUpload", Parent.NameTodo +  " (" + Parent.DateCreate.ToString("dd-MM-yyyy") +")");
                Directory.Delete(pathString, true);  
                result.message = "Xóa thành công";
            }
            catch(Exception ex)
            {
                result.message = ex.Message;
            }
            return Ok(result);
        }

        [Authorize]
        [HttpPatch("Patch/{id}")]
        public IActionResult Patch([FromBody]JsonPatchDocument<InformationList> InformationList, int id)
        {
            Response<string> result = new Response<string>();
            try
            {
                if(id <= 0 && InformationList == null)
                {
                    return BadRequest();
                }
                var user = (UserResponse)HttpContext.Items["User"];
                InformationList info = _repositoryWrapper.InformationList.FindByCondition(x => x.Id == id && x.UserName == user.UserName).FirstOrDefault();
                if(info != null)
                {
                    InformationList.ApplyTo(info);
                    _repositoryWrapper.save();
                }
            }
            catch(Exception ex){
                result.message = ex.Message;
            }
            return Ok(result);
        }
    }
}
