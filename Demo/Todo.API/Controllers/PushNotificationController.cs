using System.Security.Cryptography.X509Certificates;
using System.Linq;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Todo.Service.Service;
using Todo.API.RequestModel;
using WebPush;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Todo.Model;

using Microsoft.Extensions.Caching.Memory;

namespace Todo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PushNotificationController : ControllerBase
    {
        private readonly IRepositoryWrapper _repositoryWrapper;
        private readonly RequestPushNotification.VAPID _VAPID;
        private IMemoryCache _cache;
        public PushNotificationController(IRepositoryWrapper repositoryWrapper, IMemoryCache cache,IOptions<RequestPushNotification.VAPID> VALID)
        {
            _repositoryWrapper = repositoryWrapper;
            _cache = cache;
            _VAPID = VALID.Value;
        }


        [HttpPost("Getsubscrition")]
        public IActionResult Getsubscrition(RequestPushNotification.Request obj)
        {
            try{
                if(obj == null){    
                     return BadRequest();   
                }

                InfomationNotification data = new InfomationNotification()
                {
                    UserName = obj.UserName,
                    Endpoint = obj.subscrition.Endpoint,
                    p256dh = obj.subscrition.Keys["p256dh"],
                    auth = obj.subscrition.Keys["auth"],
                };
                List<InfomationNotification> lstInfomation = _repositoryWrapper.InformationNotification
                                                            .FindByCondition(x => x.UserName == obj.UserName)
                                                            .Select(x => new InfomationNotification{ UserName = x.UserName,Endpoint = x.Endpoint,p256dh =x.p256dh,auth = x.auth })
                                                            .ToList();
                if(lstInfomation.IndexOf(data) < 0)
                {
                    _repositoryWrapper.InformationNotification.Create(data);
                    _repositoryWrapper.save();
                }
            }
            catch(Exception ex)
            {
                
            }
           
          
            return Ok();
        }

        [HttpGet("SendNotification")]
        public async Task<IActionResult>  SendNotification(){
             
            try{
                if(_cache.TryGetValue<List<RequestPushNotification.Sub>>("lstSub", out List<RequestPushNotification.Sub> lstSub)){
                    RequestPushNotification.Sub Sub = lstSub[0];
                    var subscription = new PushSubscription(Sub.endpoint, Sub.p256dh, Sub.auth);
                    var vapidDetails = new VapidDetails(_VAPID.subject, _VAPID.publicKey, _VAPID.privateKey);
                    var webPushClient = new WebPushClient();
                    await webPushClient.SendNotificationAsync(subscription,"payload",vapidDetails);
                }   
              
            }
            catch(Exception ex)
            {
                
            }
            return Ok();
        }   

        
    }
}
