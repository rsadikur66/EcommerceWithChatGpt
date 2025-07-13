using ClassLibrary1.DAL.Setup;
using Newtonsoft.Json;
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers.Setup
{
    public class T11221Controller : Controller
    {
        T11221DAL t11221Dal = new T11221DAL();
        // GET: T11221
        [HttpPost]
        public ActionResult GetCatList()
        {
            var data = t11221Dal.GetCategoryList();
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }
    }
}