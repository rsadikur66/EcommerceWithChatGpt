using ClassLibrary1.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace DataAccessLayer.Common
{
    public class homeDAL : CommonDAL
    {
        public DataTable GetCatData()
        {
            DataTable sql = new DataTable();
            sql = Query($"select c.categoryid,c.name from T11221 c");
            return sql;
        }
        public DataTable GetSubCatData(string catId)
        {
            DataTable sql = new DataTable();
            sql = Query($"select s.SubCategoryId,s.Name From T11222 s where s.CategoryId='{catId}'");
            return sql;
        }

         public DataTable GetAllHomeProducts()
        {
            DataTable sql = new DataTable();
            //sql = Query($"select * from T12002");
            sql = Query($"select * from T11223");
            return sql;
        }

        public DataTable GetProDetailsById(string ProductId)
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from t12002 where product_id='{ProductId}'");
            return sql;
        }

         public DataTable GetModulesData()
        {
            DataTable sql = new DataTable();
            sql = Query($"select distinct t.ModuleCode,e.ModuleName,e.ModuleDesc from dbo.T11996 t  join dbo.t11997 e on t.ModuleCode = e.ModuleCode where t.RoleCode =120");
            return sql;
        }

        public DataTable GetFormsData(string RoleCode)
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from T11996 where RoleCode={RoleCode}");
            return sql;
        }

        public string OrderPlacedSaved(OrderInformation_T11224 model, List<OrderItems_T11225> list,string userCode)        
        //public string OrderPlacedSaved(OrderModel model,string userCode)
        {
            var sms = "";
            if (model.OrderID == 0)
            {
                //insert
                var insertT11221 = Command($"insert into T11224(CustomerID, OrderDate, OrderStatus, PaymentStatus, PaymentMethod, ShippingAddress, TotalAmount, ShippingCost, CreatedAt, RecipientPhone, RecipientName) values ({userCode}, '{DateTime.Now}', '{1}', '{1}', '{model.PaymentMethod}', '{model.ShippingAddress}', {model.TotalAmount}, {model.ShippingCost},'{DateTime.Now}', '{model.RecipientPhone}', '{model.RecipientName}')");

                if (insertT11221)
                {
                    sms = "Save Successfully-1";
                }
                else
                {
                    sms = "Do not Save-0";
                }
            }
            //else
            //{
            //    var updateT11221 = Command($"UPDATE T11221 SET Name='{t11221.Name}',Description='{t11221.Description}' WHERE CategoryId ={t11221.CategoryId}");
            //    if (updateT11221)
            //    {
            //        sms = "Update Successfully-1";
            //    }
            //    else
            //    {
            //        sms = "Do not Update-0";
            //    }
            //}
            return sms;
        }


    }
}
