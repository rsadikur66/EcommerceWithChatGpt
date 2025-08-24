using DataAccessLayer.Common;
using System.Data;
using ClassLibrary1.Models;
using System;

namespace ClassLibrary1.Common
{
    public class loginDAL : CommonDAL
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

            if (model.Id == 0)
            {
                string maxUserCode = Query($"select max(UserCode) + 1 maxUserCode from T11999").Rows[0]["maxUserCode"].ToString();
                int maximumUserCode = Convert.ToInt32(maxUserCode);
                //string dateTimeNow = System.DateTime.Now.ToString("dd-MM-yyyy");
                //insert
                var insertT11999 = Command($"insert into T11999 (UserCode, Username, Email, PasswordHash, FirstName, LastName, RoleCode, IsActive, CreatedAt ) values ({maximumUserCode},'{model.Username}','{model.Email}','{model.PasswordHash}','{model.FirstName}','{model.LastName}',122,1,'{DateTime.Now:yyyy-MM-dd HH:mm:ss}')");

                if (insertT11999)
                {
                    sms = "Save Successfully-1";
                }
                else
                {
                    sms = "Do not Save-0";
                }
            }
            


            return sms;
        }


    }
}
