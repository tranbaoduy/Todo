using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Todo.Model;
using Microsoft.EntityFrameworkCore;
using Todo.Service.Service;
using Todo.API.Hubs;
using Todo.API.Helpers;
using Todo.Service.RequestModel;
using Newtonsoft.Json.Serialization;

namespace Todo.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });
            //Connect
            services.AddEntityFrameworkNpgsql().AddDbContext<DbApiContext>(opt =>
            opt.UseNpgsql(Configuration.GetConnectionString("MyWebApiConection")));

            //Service
            services.AddScoped<IRepositoryWrapper, RepositoryWrapper>();
            services.AddScoped<IUserService, UserService>();
            // .AddJsonOptions(opts =>{opts.JsonSerializerOptions.PropertyNamingPolicy = null;
            // })
            //Fillter
            services.AddScoped<Todo.API.ActionFillter.TodoFillter>();
            //Cache
            services.AddMemoryCache();
            //Mail settings
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            //Gửi notification
            services.Configure<RequestModel.RequestPushNotification.VAPID>(Configuration.GetSection("VAPID"));
            services.AddTransient<IPushNotification, PushNotification>();
            //Gửi mail
            services.AddTransient<IMailService, MailService>();
            //RealTime
            services.AddSignalR(options => 
            { 
                options.EnableDetailedErrors = true; 
            }); 
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Todo.API", Version = "v1" });
            });
            
          
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(opt =>
                opt.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                );
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Todo.API v1"));
            }

            //app.UseHttpsRedirection();
           
            app.UseRouting();
            app.UseAuthorization();
            app.UseMiddleware<JwtMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<NotificationHub>("/notification");
            });
        }
    }
}
