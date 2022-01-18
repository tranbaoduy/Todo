using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Todo.Model;
using Microsoft.Extensions.Caching.Memory;
using Todo.API.RequestModel;
using WebPush;
using Microsoft.Extensions.Options;


namespace Todo.API.Hubs
{
    public interface IPushNotification
    {
        //Task ListInformationListToDay(CancellationToken cancellationToken);
        Task SendNotification(List<InformationList> lstContentNotification,List<InfomationNotification> lstInfomationNotification);
    }
    public class PushNotification : IPushNotification
    {
        private IMemoryCache _cache;
        private int number = 1;
        private readonly RequestPushNotification.VAPID _VAPID;
        
        

        public PushNotification(IMemoryCache cache,IOptions<RequestPushNotification.VAPID> VALID)
        {
            _cache = cache;
            _VAPID = VALID.Value;
            
        }

        public async Task SendNotification(List<InformationList> lstContentNotification,List<InfomationNotification> lstInfomationNotification)
        {
            for(int i =0; i < lstInfomationNotification.Count;i++)
            {   
                for(int j = 0; j < lstContentNotification.Count;j++)
                {
                    Console.WriteLine("gửi nhé !!");
                    var subscription = new PushSubscription(lstInfomationNotification[i].Endpoint, lstInfomationNotification[i].p256dh, lstInfomationNotification[i].auth);
                    var vapidDetails = new VapidDetails(_VAPID.subject, _VAPID.publicKey, _VAPID.privateKey);
                    var webPushClient = new WebPushClient();
                    var importan = lstContentNotification[j].Important == true ? "(Công việc quan trọng)" : "";
                    var PayLoad = "Còn 5 phút nữa công việc " + lstContentNotification[i].NameTodo + " bắt đầu " + importan;
                    await webPushClient.SendNotificationAsync(subscription,PayLoad,vapidDetails);
                }
            }
            // while(!cancellationToken.IsCancellationRequested)
            // {
                // _cache.TryGetValue<List<InfomationNotification>>("lstInformation", out List<InfomationNotification> lstInformation);
                // _cache.TryGetValue<List<InformationList>>("lstNotification", out List<InformationList> lstNotifaction);
                // if(lstInformation != null && lstNotifaction != null){
                //     List<InformationList> lstSend =  lstNotifaction.Where(x => x.DateCreate.TimeOfDay.Subtract(DateTime.Now.TimeOfDay).TotalMinutes <= 10).ToList();
                //     if(lstSend != null){
                //         for(int i = 0; i < lstSend.Count; i++)
                //         {
                //             var Adress = lstInformation.Where(x => x.UserName == lstSend[i].UserName).ToList();
                //             for(int j = 0; j < Adress.Count; j++)
                //             {
                //                 var subscription = new PushSubscription(Adress[i].Endpoint, Adress[i].p256dh, Adress[i].auth);
                //                 var vapidDetails = new VapidDetails(_VAPID.subject, _VAPID.publicKey, _VAPID.privateKey);
                //                 var webPushClient = new WebPushClient();
                //                 var importan = lstSend[i].Important == true ? "(Công việc quan trọng)" : "";
                //                 var PayLoad = "Còn 5 phút nữa công việc " + lstSend[i].NameTodo + " bắt đầu " + importan;
                //                 await webPushClient.SendNotificationAsync(subscription,PayLoad,vapidDetails);
                //             }
                //         }
                //     }
                   
                // }
                Console.WriteLine("oh oh !!");
               
                
            // }    
        } 

        // public async Task ListInformationListToDay(CancellationToken cancellationToken)
        // {
       
        //     while(!cancellationToken.IsCancellationRequested)
        //     {
        //         //Chạy lần đầu tiên set up đến 12h chạy lại
        //         if(number == 1){
        //             TimeSpan middnight = DateTime.Now.Date.TimeOfDay;
        //             TimeSpan timeNow = DateTime.Now.TimeOfDay;
        //             TimeSpan span = timeNow.Subtract(middnight);
        //             List<InfomationNotification> lstInformation =  _context.InfomationNotification.ToList();
        //             List<string> LstUser = lstInformation.Select(x => x.UserName).ToList();
        //             List<InformationList> lstNotifaction  = _context.informationList.Where(x => LstUser.Contains(x.UserName) && x.DateCreate.ToShortDateString() == DateTime.Now.ToShortDateString()).ToList();
        //             _cache.Set<List<InformationList>>("lstNotification", lstNotifaction);
        //             _cache.Set<List<InfomationNotification>>("lstInformation", lstInformation);
        //             Interlocked.Increment(ref number);
        //             await Task.Delay(86400000 - Convert.ToInt32(span.TotalMilliseconds));
        //         }else
        //         {
        //             //Lớn hơn 1 thì cứ 24h lấy lại 1 lần
        //             List<InfomationNotification> lstNotifaction = _context.InfomationNotification.ToList();
        //             List<string> LstUser = lstNotifaction.Select(x => x.UserName).ToList();
        //             List<InformationList> lstInformation = _context.informationList.Where(x => LstUser.Contains(x.UserName) && x.DateCreate.ToShortDateString() == DateTime.Now.ToShortDateString()).ToList();
        //             _cache.Set<List<InformationList>>("lstInformation", lstInformation);
        //             _cache.Set<List<InfomationNotification>>("lstInformationNotification", lstNotifaction);
        //             Interlocked.Increment(ref number);
        //             await Task.Delay(86400000);
        //         }
        //     }       
        // }
    }
}
