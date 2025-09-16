using ClassLibrary1.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

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

        //public string OrderPlacedSaved(OrderInformation_T11224 model, List<OrderItems_T11225> list, string userCode)
        //{
        //    var sms = "";
        //    if (model.OrderID == 0)
        //    {
        //        // Insert into T11224 and return generated OrderID
        //        string queryT11224 = $@"
        //    INSERT INTO T11224
        //    (CustomerID, OrderDate, OrderStatus, PaymentStatus, PaymentMethod, ShippingAddress, TotalAmount, ShippingCost, CreatedAt, RecipientPhone, RecipientName)
        //    VALUES
        //    ({userCode}, '{DateTime.Now}', 1, 1, '{model.PaymentMethod}', '{model.ShippingAddress}', {model.TotalAmount}, {model.ShippingCost}, '{DateTime.Now}', '{model.RecipientPhone}', '{model.RecipientName}');
        //    SELECT SCOPE_IDENTITY();";

        //        // ধরলাম আপনার Command ফাংশন object scalar return করতে পারে
        //        var orderIdObj = ExecuteScalar(queryT11224);
        //        int newOrderId = Convert.ToInt32(orderIdObj);

        //        if (newOrderId > 0)
        //        {
        //            foreach (var item in list)
        //            {
        //                string queryT11225 = $@"
        //            INSERT INTO T11225 (OrderID, ProductID, Quantity, UnitPrice)
        //            VALUES ({newOrderId}, {item.ProductID}, {item.Quantity}, {item.UnitPrice})";

        //                Command(queryT11225);
        //            }
        //            sms = "Order Placed Successfully-1";
        //        }
        //        else
        //        {
        //            sms = "Do not Save-0";
        //        }
        //    }

        //    return sms;
        //}

        public string OrderPlacedSaved(OrderInformation_T11224 model, List<OrderItems_T11225> list, string userCode)
        {
            var sms = "";
            using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString))
            {

                conn.Open();

                // 1. Application user set করা
                using (SqlCommand cmdCtx = new SqlCommand("EXEC sp_set_session_context @key, @value", conn))
                {
                    cmdCtx.Parameters.AddWithValue("@key", "ChangedBy");
                    cmdCtx.Parameters.AddWithValue("@value", userCode);  // Controller থেকে pathano
                    cmdCtx.ExecuteNonQuery();
                }

                // 2. Order insert T11224
                string queryT11224 = $@"
        INSERT INTO T11224
        (CustomerID, OrderDate, OrderStatus, PaymentStatus, PaymentMethod, ShippingAddress, TotalAmount, ShippingCost, CreatedAt, RecipientPhone, RecipientName)
        VALUES
        ({userCode}, '{DateTime.Now}', 1, 1, '{model.PaymentMethod}', '{model.ShippingAddress}', {model.TotalAmount}, {model.ShippingCost}, '{DateTime.Now}', '{model.RecipientPhone}', '{model.RecipientName}');
        SELECT SCOPE_IDENTITY();";

                int newOrderId = Convert.ToInt32(new SqlCommand(queryT11224, conn).ExecuteScalar());

                // 3. OrderItems insert T11225
                foreach (var item in list)
                {
                    string queryT11225 = $@"
            INSERT INTO T11225 (OrderID, ProductID, Quantity, UnitPrice)
            VALUES ({newOrderId}, {item.ProductID}, {item.Quantity}, {item.UnitPrice})";

                    new SqlCommand(queryT11225, conn).ExecuteNonQuery();
                }

                conn.Close();
            }

            return sms;

        }

    }
}
