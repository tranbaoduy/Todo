 
using System;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Todo.API.Hubs;
using Todo.Model;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using System.Timers;

 namespace Todo.API.BackGroundService
{
 public class Background : IHostedService
    {
        private readonly IPushNotification _IPushNotification;
        private IMemoryCache _cache;
        private readonly IServiceScopeFactory scopeFactory;
        private Timer timer;
        

        
        public Background(IPushNotification IPushNotification,IMemoryCache cache,IServiceScopeFactory scopeFactory)
        {
            _IPushNotification = IPushNotification;
            _cache = cache;
              this.scopeFactory = scopeFactory;
            
        }

        private async void GetDetailMessage(Object source, ElapsedEventArgs e) {
            using (var scope = scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<DbApiContext>();
                var now = DateTime.Now;
                // + 10p
                DateTime Plus10Minute = DateTime.Now.Subtract(new TimeSpan(0, 0, -5,0, 0));
                List<InformationList> lstContentNotification = dbContext.informationList.Where(x => x.DateCreate > DateTime.Now && x.DateCreate < Plus10Minute).ToList();
                if(lstContentNotification.Count > 0){
                    List<InfomationNotification> lstInfomationNotification = dbContext.InfomationNotification.Where(x => lstContentNotification.Select(y => y.UserName).Contains(x.UserName)).ToList();
                    await _IPushNotification.SendNotification(lstContentNotification,lstInfomationNotification);
                }
               
               
            }   
        }

        private void SetTimer()
        {
            timer = new Timer(1000*60*5);
            timer.Elapsed += GetDetailMessage;
            timer.AutoReset = true;
            timer.Enabled = true;
        }

      

        public async Task StartAsync(System.Threading.CancellationToken cancellationToken)
        {
             SetTimer();
        }

        public Task StopAsync(System.Threading.CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        
    }
}