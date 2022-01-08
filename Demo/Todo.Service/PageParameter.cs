using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Todo.Service
{
    public class PageParameter
    {
        public int PageSize { get; set; }
        public int Page { get; set; }
        public string filter { get; set; }
    }
}
