using ClassLibrary1.DAL.Setup;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Web.Mvc;
using ClassLibrary1.Models;

namespace EcommerceWithChatGpt.Controllers.Setup
{
    public class T11221Controller : Controller
    {
        T11221DAL repository = new T11221DAL();
        // GET: T11221
        [HttpPost]
        public ActionResult GetCatList()
        {
            var data = repository.GetCategoryList();
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveData(T11221 model)
        {
            if (string.IsNullOrEmpty(Session["T_EMP_ID"] as string)) { return Json("Logout-0", JsonRequestBehavior.AllowGet); }
            try
            {
                var user = Session["T_EMP_ID"].ToString();
                var data = repository.SaveData(model, user);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
    }
}