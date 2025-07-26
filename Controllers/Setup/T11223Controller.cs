using ClassLibrary1.DAL.Setup;
using ClassLibrary1.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers.Setup
{
    public class T11223Controller : Controller
    {
        T11223DAL repository = new T11223DAL();
        // GET: T11223
        public ActionResult GetSubCatList(int param)
        {
            var data = repository.GetSubCategoryList(param);
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveProduct(T11223 model)
        {
            var request = System.Web.HttpContext.Current.Request;

            //string name = request.Form["Name"];
            //string categoryId = request.Form["CategoryId"];
            //string subCategoryId = request.Form["SubCategoryId"];
            //string price = request.Form["Price"];
            //string description = request.Form["Description"];
            //string imagePath = null;

            if (request.Files.Count > 0)
            {
                var file = request.Files["ImageFile"];
                if (file != null && file.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var filePath = Server.MapPath("~/Images/" + fileName);
                    file.SaveAs(filePath);
                    model.ImagePath = "/Images/" + fileName;
                }
            }
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
            //string msg = repository.SaveData(model);

            // TODO: DB Insert করো এখানে (ADO.NET বা Entity Framework দিয়ে)

            //return Json(new { success = true, message = "Saved Successfully", image = imagePath });
        }

    }
}