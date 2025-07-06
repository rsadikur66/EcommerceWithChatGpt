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
        // GET: Login
        [HttpPost]
        public ActionResult UserLogin(string userId, string pass)
        {
            try
            {
                var sms = ""; //cmd: wmic bios get serialnumber
                              // var savetest = testDal.SaveData(); sr == "G9N0CV01J96835A"
                              //var sr = sirealNumber();
                var sr = "G9N0CV01J96835A";
                if (sr == "G9N0CV01J96835A")
                {
                    var data = loginDAL.GetData(userId, pass);
                    if (data.Rows.Count > 0)
                    {
                        foreach (DataRow i in data.Rows)
                        {
                            Session["T_EMP_ID"] = i["T_EMP_ID"].ToString();
                            // Session["site"] = "1";
                            //  Session["LOGIN_PASS"] = i["LOGIN_PASS"].ToString();
                            //  Session["LOGIN_CODE"] = i["LOGIN_CODE"].ToString();
                            Session["T_ROLE"] = i["T_ROLE"].ToString();
                            sms = "1" + "-" + i["T_ROLE"].ToString();
                            // var myStr = Session["someKey1"] as String;
                        }
                    }
                    else
                    {
                        sms = "2";
                    }
                }
                else
                {
                    sms = "3";
                }

                return Json(sms, JsonRequestBehavior.AllowGet);
            }
            catch (Exception exc)
            {
                return Json(exc.Message, JsonRequestBehavior.AllowGet);
            }
        }
    }
}