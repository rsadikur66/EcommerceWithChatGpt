using ClassLibrary1.Models;
using DataAccessLayer.Common;
using System;
using System.Data;

namespace ClassLibrary1.DAL.Setup
{
    public class T11222DAL : CommonDAL
    {
        public DataTable GetSubCategoryList()
        {
            return Query($"select t22.SubCategoryId,t22.CategoryId,t21.Name CategoryName,t22.Name,t22.Description from T11222 t22 join t11221 t21 on t22.CategoryId = t21.CategoryId");
        }

        public string SaveData(T11222 t11222)
        {
            var sms = "";
            if (t11222.SubCategoryId == 0)
            {
                //insert
                var insertT11222 = Command($"insert into T11222(CategoryId, Name, Description) values ({t11222.CategoryId},'{t11222.Name}','{t11222.Description}')");

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
                var updateT11222 = Command($"UPDATE T11222 SET Name='{t11222.Name}',Description='{t11222.Description}' WHERE SubCategoryId ={t11222.SubCategoryId}");
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
