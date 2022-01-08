using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Todo.Service.Service;
using Todo.Model;
using Todo.Service.RequestModel;

namespace Todo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IRepositoryWrapper _repositoryWrapper;
        private readonly IUserService _userService;

        public UserController(IRepositoryWrapper repositoryWrapper, IUserService userService)
        {
            _repositoryWrapper = repositoryWrapper;
            _userService = userService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserRequest user)
        {
            Response<string> result = new Response<string>();
            try
            {
                if (user == null)
                {
                    return BadRequest();
                }
                int IsSuccess = _repositoryWrapper.User.Login(user);
                if(IsSuccess == 1) {
                    result.status = "200";
                    result.message = "Đăng nhập thành công";
                }
                if(IsSuccess == 0)
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
        public async Task<IActionResult> Insert(User user)
        {
            Response<string> result = new Response<string>();
            try
            {
                if (user == null)
                {
                    return BadRequest();
                }

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

        
    }
}
