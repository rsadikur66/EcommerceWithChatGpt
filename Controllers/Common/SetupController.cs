
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers.Common
{
    public class SetupController : Controller
    {
        // GET: Setup
        public ActionResult T11221()
        {
            if (Session["UserCode"] == null)
            {
                return RedirectToAction("Login", "Login");
            }
            return View();
        }
        public ActionResult T11222()
        {
            if (Session["UserCode"] == null)
            {
                return RedirectToAction("Login", "Login");
            }
            return View();
        }
        public ActionResult T11223()
        {
            if (Session["UserCode"] == null)
            {
                return RedirectToAction("Login", "Login");
            }
            return View();
        }
        public ActionResult T11224()
        {
            if (Session["UserCode"] == null)
            {
                return RedirectToAction("Login", "Login");
            }
            return View();
        }




    }
}