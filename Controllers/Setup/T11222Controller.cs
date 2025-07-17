using ClassLibrary1.DAL.Setup;
using Newtonsoft.Json;
using System;
using System.Web.Mvc;
using ClassLibrary1.Models;

namespace EcommerceWithChatGpt.Controllers.Setup
{
    public class T11222Controller : Controller
    {
        T11222DAL repository = new T11222DAL();
        // GET: T11222
        [HttpPost]
        public ActionResult GetSubCatList()
        {
            var data = repository.GetSubCategoryList();
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveData(T11222 model)
        {
            if (string.IsNullOrEmpty(Session["UserCode"] as string)) { return Json("Logout-0", JsonRequestBehavior.AllowGet); }
            try
            {
                var data = repository.SaveData(model);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
    }
}