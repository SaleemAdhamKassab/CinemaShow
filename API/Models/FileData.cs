using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularToAPI.Models
{
    public partial class FileData
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string MimeType { get; set; }
        public string FilePath { get; set; }
    }
}
