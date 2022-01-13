using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Todo.Service.Service;
using Todo.Model;
using Todo.Service.RequestModel;
using System.Security.Cryptography;
using System.Text;
using Todo.API.Helpers;
using Todo.API.Function;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using Microsoft.AspNetCore.JsonPatch;
namespace Todo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IRepositoryWrapper _repositoryWrapper;
        private readonly IUserService _userService;
        private readonly IMailService _mailService;
        private IMemoryCache _cache;

        public UserController(IRepositoryWrapper repositoryWrapper, IUserService userService,IMailService mailService,IMemoryCache cache)
        {
            _repositoryWrapper = repositoryWrapper;
            _userService = userService;
            _mailService = mailService;
            _cache = cache;
        }

        [HttpPost("Login")]
        public IActionResult Login(UserRequest user)
        {
            Response<UserResponse> result = new Response<UserResponse>();
            try
            {
                if (user == null)
                {
                    return BadRequest();
                }               
                UserResponse userResponse = _repositoryWrapper.User.Login(user);
                if(userResponse != null) {
                    result.data = userResponse;
                    result.status = "200";
                    result.message = "Đăng nhập thành công";
                }
                if(userResponse == null)
                {
                    result.status = "404";
                    result.message = "Mật Khẩu hoặc tên đăng nhập không chính xác";
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            return Ok(result);
        }

        [HttpPost("Insert")]
        public IActionResult Insert(User user)
        {
            Response<string> result = new Response<string>();
            try
            {
                if (user == null)
                {
                    return BadRequest();
                }

                //Ecrypt PassWord
                MD5 md5 = new MD5CryptoServiceProvider();
                md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(user.PassWord));
                byte[] pass = md5.Hash;
                StringBuilder passMd5 = new StringBuilder();
                for (int i = 0; i < pass.Length; i++)
                {
                    passMd5.Append(pass[i].ToString("x2"));
                }
                user.PassWord = passMd5.ToString();
                _repositoryWrapper.User.Create(user);
                _userService.Save();
                result.status = "200";
                result.message = "Thêm mới thành công";
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            return Ok(result);
        }

        [HttpGet("GetUser/{UserName}")]
        public IActionResult GetUser(string UserName)
        {
            Response<User> result = new Response<User>();
            try
            {
                if (String.IsNullOrEmpty(UserName))
                {
                    return BadRequest();
                }
                result.data = _repositoryWrapper.User.FindByCondition(x => x.UserName == UserName).FirstOrDefault();
                result.status = "200";
                result.message = "Thêm mới thành công";
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            return Ok(result);
        }


        [HttpPost("CheckUser")]
        public async Task<IActionResult> CheckUser(RequestModel.RequestUser.ForgotPassWord model)
        {
            Response<string> result = new Response<string>();
            try
            {
                if(model == null){
                    return BadRequest();
                }
                function fc = new function();
                User IsExit = _repositoryWrapper.User.FindById(x => x.UserName == model.UserName);   
                if(IsExit != null){
                    //Sinh mã và lưu vào cache
                    Random _random = new Random();
                    int num = _random.Next(1000,9999);
                    RequestModel.RequestUser.ObjResetPassWprd ResponUser = new RequestModel.RequestUser.ObjResetPassWprd()
                    {
                        UserName = IsExit.UserName,
                        CodeReset = num,
                        TimeCreate = DateTime.Now
                    };  
                    
                    //Lưu vào cache
                    if(!_cache.TryGetValue<List<RequestModel.RequestUser.ObjResetPassWprd>>("lstResetPass", out List<RequestModel.RequestUser.ObjResetPassWprd> lstResetPass)){
                        List<RequestModel.RequestUser.ObjResetPassWprd> lstReset = new List<RequestModel.RequestUser.ObjResetPassWprd>();
                        lstReset.Add(ResponUser);
                        _cache.Set<List<RequestModel.RequestUser.ObjResetPassWprd>>("lstResetPass", lstReset);
                    } else {
                        lstResetPass.Add(ResponUser);
                        _cache.Set<List<RequestModel.RequestUser.ObjResetPassWprd>>("lstResetPass", lstResetPass);
                    }
                   
                    //Gửi mã code vào Email    
                    MailRequest request = new MailRequest(){
                        ToEmail = IsExit.Email,
                        Body = "Mã code của bạn là :" + num,
                        Subject = "Yêu cầu xác nhận Email"
                    };
                    await _mailService.SendEmailAsync(request);

                }else{
                    result.message = "UserName hoặc Email không chính xác";
                }
            }
            catch(Exception ex)
            {
                result.message = ex.Message.ToString();
            }
            return Ok(result);

        } 

        [HttpPost("CheckCode")]
        public IActionResult CheckCode(RequestModel.RequestUser.ObjResetPassWprd model)
        {
            Response<string> result = new Response<string>();
            try
            {
                if(model == null)
                {
                    return BadRequest();
                }

                ;
                if(_cache.TryGetValue<List<RequestModel.RequestUser.ObjResetPassWprd>>("lstResetPass", out List<RequestModel.RequestUser.ObjResetPassWprd> lstResetPass)){
                    for(int i = 0; i < lstResetPass.Count; i++){
                        if(lstResetPass[i].UserName == model.UserName && lstResetPass[i].CodeReset == model.CodeReset)
                        {
                            TimeSpan Now = DateTime.Now.TimeOfDay;
                            TimeSpan Create = lstResetPass[i].TimeCreate.TimeOfDay;
                            TimeSpan span = Now.Subtract(Create);
                            if(span.TotalMinutes  > 5){
                                result.message = "Mã đã quá hạn";
                                return BadRequest(result);
                            }else{
                                lstResetPass.Remove(lstResetPass[i]);
                                _cache.Set<List<RequestModel.RequestUser.ObjResetPassWprd>>("lstResetPass", lstResetPass);
                                string Token = _repositoryWrapper.User.generateJwtTokenForResetPassWord();
                                result.data = Token;
                                result.message = "Mời bạn nhập lại mật khẩu !";     
                            }
                        }
                        if(lstResetPass[i].UserName == model.UserName  && lstResetPass[i].CodeReset != model.CodeReset){
                            result.message = "Mã code không chính xác"; 
                            return BadRequest(result);
                        }
                        break;
                    }
                }           
            }
            catch(Exception ex)
            {
                result.message= ex.Message;
            }
            return Ok(result);
        }

        [HttpPost("ChangePassWord")]
        public IActionResult ChangePassWord(RequestModel.RequestUser.ResetForgotPassWord user)
        {
            Response<string> result = new Response<string>();
            try
            {
                if(user == null){
                    return BadRequest();
                }
                if(_repositoryWrapper.User.checkTokenResetPassWord(user.Token)){
                    User oldUser = _repositoryWrapper.User.FindByCondition(x => x.UserName == user.UserName).FirstOrDefault();
                    // if(oldUser == null){
                    //     return BadRequest();
                    // }
                    //Ecrypt PassWord
                    MD5 md5 = new MD5CryptoServiceProvider();
                    md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(user.PassWord));
                    byte[] pass = md5.Hash;
                    StringBuilder passMd5 = new StringBuilder();
                    for (int i = 0; i < pass.Length; i++)
                    {
                        passMd5.Append(pass[i].ToString("x2"));
                    }
                    oldUser.PassWord = passMd5.ToString();
                    _repositoryWrapper.User.Update(oldUser);
                    _repositoryWrapper.save();
                    result.message = "Thay đổi mật khẩu thành công.";
                }else{
                    return BadRequest(StatusCode(401));
                }
               
            }
            catch(Exception ex){
                result.message = ex.Message;
            }
            return Ok(result);
            
        }
        [Authorize]
        [HttpPut("Update/{id}")]
        public IActionResult Update(int id,User user)
        {
            Response<string> result = new Response<string>();
            try
            {
                if(user == null)
                {
                    return BadRequest();
                }
                User oldUser = _repositoryWrapper.User.FindByCondition(x => x.Id == id).FirstOrDefault();
                if(oldUser != null){
                    oldUser.UserName = user.UserName;
                    oldUser.Email = user.Email;
                    oldUser.FullName = user.FullName;
                    _repositoryWrapper.User.Update(oldUser);
                    _repositoryWrapper.save();
                    result.message = "Câp nhật thành công !!";
                }
            }
            catch(Exception ex){
                result.message = ex.Message;
            };
            return Ok(result);
        }

        [Authorize]
        [HttpPatch("Patch/{id}")]
        public IActionResult Patch([FromBody]JsonPatchDocument<User> UserNew, int id)
        {
            Response<string> result = new Response<string>();
            try
            {
                if(id <= 0 && UserNew == null)
                {
                    return BadRequest();
                }
                User info = _repositoryWrapper.User.FindByCondition(x => x.Id == id).FirstOrDefault();
                if(info != null)
                {
                     UserNew.ApplyTo(info);
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
