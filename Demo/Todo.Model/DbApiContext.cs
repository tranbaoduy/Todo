using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Todo.Model
{
    public class DbApiContext: DbContext
    {
        public DbApiContext(DbContextOptions<DbApiContext> options) : base(options) { }
        public DbSet<User> user {get;set;}
        public DbSet<Job> job {get;set;}
        public DbSet<InformationList> informationList {get;set;}
    }
}
