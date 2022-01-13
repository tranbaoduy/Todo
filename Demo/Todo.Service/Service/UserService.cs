using Todo.Model;
using Todo.Service.Base;
using System;
using System.Linq;
using Todo.Service.RequestModel;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
namespace Todo.Service.Service
{
    public interface IUserService : IBaseService<User>
    {
        UserResponse Login (UserRequest user);
        UserResponse user (int id);
        string generateJwtTokenForResetPassWord();
        bool checkTokenResetPassWord(string Token);
    }

   
    public class UserService : BaseService<User>, IUserService
    {
        public UserService(DbApiContext _context) : base(_context)
        {
        }
        public UserResponse Login(UserRequest user){
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
            User IsExist = dbcontext.user.FirstOrDefault(x => x.UserName == user.UserName && x.PassWord == user.PassWord);
            string token = generateJwtToken(IsExist);
            return new UserResponse(IsExist,token);
        }

         private string _appSettings = "15648132187931665311156213789556483254";

        private string generateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string generateJwtTokenForResetPassWord()
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool checkTokenResetPassWord(string Token){
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_appSettings);
                tokenHandler.ValidateToken(Token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);
                var jwtToken = (JwtSecurityToken)validatedToken;
                return true;
            }
            catch
            {
                return false;
            }
        }

        public UserResponse user(int id){
            var user = base.dbcontext.user.FirstOrDefault(x => x.Id == id);
            return new UserResponse(user,"");
        }


    }
}
