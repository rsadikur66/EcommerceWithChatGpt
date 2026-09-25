using ClassLibrary1.Models;
using DataAccessLayer.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers
{
    public class HomeController : Controller
    {
        homeDAL repository = new homeDAL();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Details()
        {
            return View();
        }
        public ActionResult Product()
        {
            return View();
        }

        public ActionResult Cart()
        {
            return View();
        }
        public ActionResult Checkout()
        {
            return View();
        }
        //public ActionResult InvoiceReport(string orderId)
        //{
        //    ViewBag.OrderId = orderId;
        //    return View("InvoiceReport"); // InvoiceReport.cshtml ভিউটি রিটার্ন করবে
        //}
        public ActionResult H00001()
        {
            if (Session["UserCode"] == null)
            {
                return RedirectToAction("Login", "Login");
            }
            return View();
        }

        public ActionResult H00002()
        {
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        public ActionResult LoadProducts(int? catid, int? subcatid)
        {
            //var products = db.Products.AsQueryable();

            //if (catid != null)
            //    products = products.Where(p => p.CategoryId == catid);

            //if (subcatid != null)
            //    products = products.Where(p => p.SubCategoryId == subcatid);

            //return Json(products.ToList(), JsonRequestBehavior.AllowGet);
            try
            {
                var data = repository.GetProductsByCatAndSubCat(catid,subcatid);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(data);
                return Json(JSONString, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult SearchProduct(string param)
        {
            try
            {
                var data = repository.GetProductsBySearchText(param);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(data);
                return Json(JSONString, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult LoadCategory()
        {
            try
            {
                var data = repository.GetCatData();
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(data);
                return Json(JSONString, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult LoadSubCategory(string param)
        {
            try
            {
                var data = repository.GetSubCatData(param);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(data);
                return Json(JSONString, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult LoadAllHomeProducts()
        {
            try
            {
                var data = repository.GetAllHomeProducts();
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(data);
                return Json(JSONString, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult OrderPlaced(OrderInformation_T11224 model, List<OrderItems_T11225> list)
        {
            try
            {
                if (Session["UserCode"] == null)
                {
                    return Json(new { success = false, message = "0001" }, JsonRequestBehavior.AllowGet);
                }

                var userCode = Session["UserCode"].ToString();
                var result = repository.OrderPlacedSaved(model, list, userCode);

                return Json(new
                {
                    success = result.Success,
                    orderId = result.OrderId,
                    message = result.Message
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult ProductsDetailsByIdData(string param)
        {
            try
            {
                var data = repository.GetProDetailsById(param);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(data);
                return Json(JSONString, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        //For Module Page Start
        [HttpPost]
        public ActionResult LoadModules()
        {
            try
            {
                var data = repository.GetFormsData(Session["RoleCode"].ToString());
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(data);
                return Json(JSONString, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        //For Module Page End

        //public ActionResult SearchProduct(string id)
        //{
        //   try
        //    {
        //        var data = repository.GetSearchTextData(id);
        //        string JSONString = string.Empty;
        //        JSONString = JsonConvert.SerializeObject(data);
        //        return Json(JSONString, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(ex.Message, JsonRequestBehavior.AllowGet);
        //    }
        //}

        public ActionResult InvoiceReport(int orderId)
        {
            if (Session["UserCode"] == null)
            {
                return RedirectToAction("Login", "Login");
            }

            var userCode = Session["UserCode"].ToString();
            var model = repository.GetOrderInvoice(orderId, userCode);

            if (model == null)
            {
                // অর্ডার নেই অথবা অন্য কারো অর্ডার — অ্যাক্সেস দেওয়া হবে না
                return HttpNotFound("Order not found.");
            }

            return View("InvoiceReport", model);
        }


    }
}