
using System.Web.Mvc;

namespace EcommerceWithChatGpt.Controllers.Common
{
    public class TransactionController : Controller
    {
        // GET: Transaction
        public ActionResult T11231()
        {
            if (Session["UserCode"] == null)
            {
                return RedirectToAction("Login", "Login");
            }
            return View();
        }
    }
}