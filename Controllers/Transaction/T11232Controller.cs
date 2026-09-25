using ClassLibrary1.DAL.Transaction;
using ClassLibrary1.Models;
using Newtonsoft.Json;
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers.Transaction
{
    public class T11232Controller : Controller
    {
        T11232DAL repository = new T11232DAL();

        // GET: T11232 — প্রোডাক্ট + বর্তমান স্টক লিস্ট
        public ActionResult GetProductStockList()
        {
            var data = repository.GetProductStockList();
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }

        // ============================================================
        // স্টক Add/Reduce করা ("param" নামটা Service.js এর
        // loadDataSingleParm কনভেনশন অনুযায়ী)
        // ============================================================
        [HttpPost]
        public ActionResult AdjustStock(StockAdjustRequest param)
        {
            if (Session["UserCode"] == null)
            {
                return Json(new { success = false, message = "Session expired. অনুগ্রহ করে আবার লগইন করুন।" });
            }

            if (param == null || param.ProductID <= 0 || param.Quantity <= 0 ||
                (param.ChangeType != "IN" && param.ChangeType != "OUT"))
            {
                return Json(new { success = false, message = "Invalid request." });
            }

            var changedBy = Session["Username"] != null
                ? Session["Username"].ToString()
                : Session["UserCode"].ToString();

            var result = repository.AdjustStock(param.ProductID, param.ChangeType, param.Quantity, param.Reason, changedBy);

            return Json(new { success = result.Success, message = result.Message, productId = result.OrderId });
        }

        // ============================================================
        // একটা প্রোডাক্টের স্টক-মুভমেন্ট টাইমলাইন (T11227)
        // ============================================================
        [HttpPost]
        public ActionResult GetStockMovementHistory(int param)
        {
            var data = repository.GetStockMovementHistory(param);
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }
    }
}