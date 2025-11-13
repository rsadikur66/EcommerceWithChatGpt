

using System.Web.Mvc;

namespace ClassLibrary1.Models
{
    public class T11223
    {        
            public string Name { get; set; }
            public int CategoryId { get; set; }
            public int SubCategoryId { get; set; }
            public decimal Price { get; set; }
            [AllowHtml]
            public string Description { get; set; }
            public string ImagePath { get; set; }
        
    }
}
