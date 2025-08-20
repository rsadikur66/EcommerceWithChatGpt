using DataAccessLayer.Common;
using System.Data;
using ClassLibrary1.Models;

namespace ClassLibrary1.Common
{
    public class loginDAL :CommonDAL
    {
        public DataTable GetData(string userName, string pass)
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from T11999 where Username='{userName}' and PasswordHash='{pass}' and IsActive != 0");
            return sql;
        }

        public string CustomerRegistration(RegisterModel model)
        {
            string sms = "";

            return sms;
        }


    }
}
