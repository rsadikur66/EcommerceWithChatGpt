using ClassLibrary1.DAL.Transaction;
using Newtonsoft.Json;
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers.Transaction
{
    public class T11231Controller : Controller
    {
        
        T11231DAL repository = new T11231DAL();
        // GET: T11231
        public ActionResult GetOrderList()
        {
            var data = repository.GetOrdersList();
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }
    }
}