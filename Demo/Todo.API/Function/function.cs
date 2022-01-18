using System.Runtime.Serialization.Formatters.Binary;
using System.IO;
using System;
using System.Collections.Generic;
using Todo.API.RequestModel;

namespace Todo.API.Function
{
    public class function
    {
        public class DetailFile {
            public string fileName {get;set;}
            public string base64String {get;set;}
        }
       public async void uploadFile(List<RequestTodo.FileModel> lstfile,string pathUpload){
            for(int i = 0 ; i < lstfile.Count; i++){
                string pathAttach =  System.IO.Path.Combine(pathUpload, lstfile[i].fileName);
                var index = lstfile[i].formFiles.IndexOf(',');
                var base64string = lstfile[i].formFiles.Substring(index + 1);
                byte [] bytes =  Convert.FromBase64String(base64string);
                await System.IO.File.WriteAllBytesAsync(pathAttach,bytes);
            }
        }
        public List<DetailFile> getFile(string NameTodo)
        {
            List<DetailFile> result = new List<DetailFile>();
            string startupPath = System.IO.Directory.GetCurrentDirectory();
            string pathString = System.IO.Path.Combine(startupPath + "\\fileUpload", NameTodo);
            //Lấy tất cả các file của công việc
            string[] fileEntries = Directory.GetFiles(pathString);
            foreach (var item in fileEntries)
            {
                FileInfo fi = new FileInfo(item);
                //Lấy thông tin loại type (.docx,.xlsx)
                string extn = fi.Extension; 
                string headBase64 =  getExtension(extn);
                //Lấy fileName
                string justFileName = fi.Name;
                byte[] AsBytes = File.ReadAllBytes(item);
                String AsBase64String = Convert.ToBase64String(AsBytes);
                DetailFile itemDetail = new DetailFile(){
                    fileName =  justFileName,
                    base64String = "data:" + headBase64 + ";base64," + AsBase64String
                };
                result.Add(itemDetail);
            }
            return result;
        }    

        public string getExtension(string extn){
            string result = "";
            switch(extn) 
            {
                case ".doc":
                    result = "application/msword";
                    break;
                case ".dot":
                    result = "application/msword";
                    break;
                case ".docx":
                    result = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    break;
                case ".dotx":
                    result = "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
                    break;
                case ".docm":
                    result = "application/vnd.ms-word.document.macroEnabled.12";
                    break;
                case ".dotm":
                    result = "application/vnd.ms-word.template.macroEnabled.12";
                    break;
                case ".xls":
                    result = "application/vnd.ms-word.template.macroEnabled.12";
                    break;
                case ".xlt":
                    result = "application/vnd.ms-word.template.macroEnabled.12";
                    break;
                case ".xla":
                    result = "application/vnd.ms-excel";
                    break;
                case ".xlsx":
                    result = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                     break;
                case ".xltx":
                    result = "application/vnd.openxmlformats-officedocument.spreadsheetml.template";
                     break;
                case ".xlsm":
                    result = "application/vnd.ms-excel.sheet.macroEnabled.12";
                     break;
                case ".xltm":
                    result = "application/vnd.ms-excel.template.macroEnabled.12";
                     break;
                case ".xlam":
                    result = "application/vnd.ms-excel.addin.macroEnabled.12";
                     break;
                case ".xlsb":
                    result = "application/vnd.ms-excel.sheet.binary.macroEnabled.12";
                    break;
                case ".ppt":
                    result = "application/vnd.ms-powerpoint";
                    break;
                case ".pot":
                    result = "application/vnd.ms-powerpoint";
                    break;
                case ".ppa":
                    result = "application/vnd.ms-powerpoint";
                    break;
                case ".pptx":
                    result = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                    break;
                case ".potx":
                    result = "application/vnd.openxmlformats-officedocument.presentationml.template";
                    break;
                case ".ppsx":
                    result = "application/vnd.openxmlformats-officedocument.presentationml.slideshow";
                    break;
                case ".ppam":
                    result = "application/vnd.ms-powerpoint.addin.macroEnabled.12";
                    break;
                case ".pptm":
                    result = "application/vnd.ms-powerpoint.presentation.macroEnabled.12";
                    break;
                case ".potm":
                    result = "application/vnd.ms-powerpoint.template.macroEnabled.12";
                    break;
                case ".ppsm":
                    result = "application/vnd.ms-powerpoint.slideshow.macroEnabled.12";
                    break;
                case ".mdb":
                    result = "application/vnd.ms-access";
                    break;
                default:
                    result = "";
                    break;
            }
            return result;
        }

        public string EncodePasswordtoBase64(string password)
        {
            try 
            {
                byte[] encData_byte = new byte[password.Length]; 
                encData_byte = System.Text.Encoding.UTF8.GetBytes(password); 
                string encodedData = Convert.ToBase64String(encData_byte); 
                return encodedData; 
            } 
            catch (Exception ex) 
            { 
                throw new Exception("Error in base64Encode" + ex.Message); 
            } 
        }

        public byte[] ObjectToByteArray(object obj)
        {
            if(obj == null)
                return null;

            BinaryFormatter bf = new BinaryFormatter();
            MemoryStream ms = new MemoryStream();
            bf.Serialize(ms, obj);

            return ms.ToArray();
        }

        public Object ByteArrayToObject(byte[] arrBytes)
        {
            MemoryStream memStream = new MemoryStream();
            BinaryFormatter binForm = new BinaryFormatter();
            memStream.Write(arrBytes, 0, arrBytes.Length);
            memStream.Seek(0, SeekOrigin.Begin);
            Object obj = (Object) binForm.Deserialize(memStream);

            return obj;
        }
                    
    }
}
