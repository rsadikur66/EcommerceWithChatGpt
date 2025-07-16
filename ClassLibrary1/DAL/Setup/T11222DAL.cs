using ClassLibrary1.Models;
using DataAccessLayer.Common;
using System;
using System.Data;

namespace ClassLibrary1.DAL.Setup
{
    public class T11222DAL : CommonDAL
    {
        public DataTable GetCategoryList()
        {
            return Query($"SELECT * FROM T11222");
        }

        public string SaveData(T11222 t11222)
        {
            var sms = "";
            if (t11222.CategoryId == 0)
            {
                //insert
                var insertT11222 = Command($"insert into t11222(Name, Description) values('{t11222.Name}','{t11222.Description}')");

                if (insertT11222)
                {
                    sms = "Save Successfully-1";
                }
                else
                {
                    sms = "Do not Save-0";
                }
            }
            else
            {
                var updateT11222 = Command($"UPDATE T11221 SET Name='{t11222.Name}',Description='{t11222.Description}' WHERE CategoryId ={t11222.CategoryId}");
                if (updateT11222)
                {
                    sms = "Update Successfully-1";
                }
                else
                {
                    sms = "Do not Update-0";
                }
            }
            return sms;
        }
    }
}
