using System;
using System.Collections.Generic;

namespace Todo.Service
{
   public class PageModel<T>
    {
        public int TotalPage { get; set; }
        public List<T> data { get; set; }
        public int cout { get; set; }
    }
}
