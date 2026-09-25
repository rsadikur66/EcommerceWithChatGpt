using ClassLibrary1.DAL.Transaction;
using ClassLibrary1.Models;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System;
using System.Data;
using System.IO;
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

        // ============================================================
        // Admin/Owner Order Invoice — কাস্টমার চেকআউটের পর যে HTML ইনভয়েস
        // দেখে (Home/InvoiceReport), সেই একই ভিউটাই এখানে রি-ইউজ করা হচ্ছে।
        // পার্থক্য শুধু এই যে এখানে CustomerID ownership check নেই, কারণ
        // অ্যাডমিন/দোকান-মালিককে যেকোনো কাস্টমারের অর্ডার দেখতে দিতে হবে।
        // ============================================================
        public ActionResult OrderInvoice(int orderId)
        {
            if (Session["UserCode"] == null)
            {
                return RedirectToAction("Login", "Login");
            }

            var model = repository.GetOrderInvoiceForAdmin(orderId);

            if (model == null)
            {
                return HttpNotFound("Order not found.");
            }

            // Home কন্ট্রোলারের ভিউটাই সরাসরি রেন্ডার করা হচ্ছে, ফাইল ডুপ্লিকেট না করে
            return View("~/Views/Home/InvoiceReport.cshtml", model);
        }

        // ============================================================
        // অর্ডারের স্ট্যাটাস আপডেট করা (Pending → Confirmed → Shipped → ...)
        // "param" নামটা Service.js এর loadDataSingleParm কনভেনশন অনুযায়ী
        // ({ param: {...} } হিসেবে পোস্ট হয়)
        // ============================================================
        [HttpPost]
        public ActionResult UpdateOrderStatus(OrderStatusUpdateRequest param)
        {
            if (Session["UserCode"] == null)
            {
                return Json(new { success = false, message = "Session expired. অনুগ্রহ করে আবার লগইন করুন।" });
            }

            if (param == null || param.OrderID <= 0 || string.IsNullOrEmpty(param.Status))
            {
                return Json(new { success = false, message = "Invalid request." });
            }

            var changedBy = Session["Username"] != null
                ? Session["Username"].ToString()
                : Session["UserCode"].ToString();

            var result = repository.UpdateOrderStatus(param.OrderID, param.Status, changedBy);

            return Json(new { success = result.Success, message = result.Message, orderId = result.OrderId });
        }

        // ============================================================
        // একটা নির্দিষ্ট অর্ডারের স্ট্যাটাস-চেঞ্জ টাইমলাইন (T11226)
        // ============================================================
        [HttpPost]
        public ActionResult GetOrderStatusHistory(int param)
        {
            var data = repository.GetOrderStatusHistory(param);
            string jsonData = JsonConvert.SerializeObject(data);
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }


        public ActionResult Customer_Order_InvoiceReport()
        {
            LocalReport lr = new LocalReport();
            string path = Path.Combine(Server.MapPath("~/Reports"), "Customer_Invoice.rdlc");

            lr.ReportPath = path;

            DataTable dt = repository.GetOrderDetailsReportData();

            ReportDataSource rd = new ReportDataSource("dsCustomer_Invoice", dt);
            lr.DataSources.Clear();
            lr.DataSources.Add(rd);

            string reportType = "PDF";
            string mimeType;
            string encoding;
            string fileNameExtension;

            string[] streams;
            Warning[] warnings;

            byte[] renderedBytes = lr.Render(
                reportType,
                null,
                out mimeType,
                out encoding,
                out fileNameExtension,
                out streams,
                out warnings
            );

            //return File(renderedBytes, mimeType, "Customer_Invoice.pdf");
            return File(renderedBytes, "application/pdf");

        }


        private DataTable GetSalesData()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("OrderId", typeof(int));
            dt.Columns.Add("OrderDate", typeof(DateTime));
            dt.Columns.Add("CustomerName", typeof(string));
            dt.Columns.Add("TotalAmount", typeof(decimal));

            // Demo data
            dt.Rows.Add(1, DateTime.Now, "Rahim", 1200);
            dt.Rows.Add(2, DateTime.Now, "Karim", 2500);

            return dt;
        }
    }
}