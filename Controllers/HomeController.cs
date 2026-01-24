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
        public ActionResult SearchProduct(string text)
        {
            try
            {
                var data = repository.GetProductsBySearchText(text);
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
        //public ActionResult OrderPlaced(OrderModel model)
        {
            try
            {
                if (Session["UserCode"] == null)
                {
                    return Json(new { success = false, message = "0001" },
                        JsonRequestBehavior.AllowGet);
                }



                // 3. UserCode নিয়ে order save করা
                var userCode = Session["UserCode"].ToString();

                //var result = orderDAL.SaveOrder(order, userCode);
                var data = repository.OrderPlacedSaved(model, list, userCode);
                //var data = repository.OrderPlacedSaved(model,userCode);
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


    }
}