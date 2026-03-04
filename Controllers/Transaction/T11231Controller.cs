using ClassLibrary1.DAL.Transaction;
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