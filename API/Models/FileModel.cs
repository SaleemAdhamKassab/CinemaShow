using Microsoft.AspNetCore.Http;

namespace AngularToAPI.Models
{
    public class FileModel
    {
        public IFormFile MyFile { get; set; }
        public string AltText { get; set; }
        public string Description { get; set; }
    }
}
