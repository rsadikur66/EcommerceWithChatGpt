using ClassLibrary1.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers.Common
{
    public class LoginController : Controller
    {
        loginDAL loginDAL = new loginDAL();

        public ActionResult Login()
        {
            return View();
        }
        // GET: Login
        [HttpPost]
        public ActionResult UserLogin(string userId, string pass)
        {
            try
            {
                var sms = ""; //cmd: wmic bios get serialnumber
                              // var savetest = testDal.SaveData(); sr == "G9N0CV01J96835A"
                              //var sr = sirealNumber();
                              //var sr = "G9N0CV01J96835A";
                              //if (sr == "G9N0CV01J96835A")
                              //{
                var data = loginDAL.GetData(userId, pass);
                if (data.Rows.Count > 0)
                {
                    foreach (DataRow i in data.Rows)
                    {
                        Session["UserCode"] = i["UserCode"].ToString();
                        Session["Username"] = i["Username"].ToString();
                        Session["FirstName"] = i["FirstName"].ToString();
                        Session["LastName"] = i["LastName"].ToString();
                        Session["RoleCode"] = i["RoleCode"].ToString();
                        sms = "1" + "-" + i["RoleCode"].ToString();
                        // var myStr = Session["someKey1"] as String;
                    }
                }
                else
                {
                    sms = "2";
                }
                //}
                //else
                //{
                //    sms = "3";
                //}

                return Json(sms, JsonRequestBehavior.AllowGet);
            }
            catch (Exception exc)
            {
                return Json(exc.Message, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult Logout()
        {
            Session.Clear();
            Session.Abandon();
            //FormsAuthentication.SignOut();

            // Optional cache control
            Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();

            return Json(new { success = true });
        }
    }
}