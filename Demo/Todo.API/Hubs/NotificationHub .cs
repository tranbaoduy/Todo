using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Todo.API.RequestModel;

namespace Todo.API.Hubs
{
    public class NotificationHub : Hub
    {        
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message); 
        }
    }
}
