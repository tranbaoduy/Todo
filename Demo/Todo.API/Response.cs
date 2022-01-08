using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Todo.API
{
    public class Response<T>
    {
        private string Status { get; set; }
        private string Message { get; set; }

        private T Data { get; set; }

        public string status
        {
            get => Status;
            set
            {
                Status = value;
            }
        }

        public string message
        {
            get => Message;
            set
            {
                Message = value;
            }
        }

        public T data
        {
            get => Data;
            set
            {
                Data = value;
            }
        }

        public Response()
        {

        }
    }
}
