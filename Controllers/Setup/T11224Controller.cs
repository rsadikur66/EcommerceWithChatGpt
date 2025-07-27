using ClassLibrary1.DAL.Setup;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers.Setup
{
    public class T11224Controller : Controller
    {
        T11224DAL repository = new T11224DAL();
        // GET: T11224
        public ActionResult GetAllProductsData()
        {
            var data = repository.GetAllProducts();
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }
    }
}