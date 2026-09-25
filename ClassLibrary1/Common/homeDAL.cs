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

        public DataTable GetProductsByCatAndSubCat(int? catId,int? subCat)
        {
            DataTable sql = new DataTable();
            if (catId != null)
            {
                sql = Query($"select * from T11223 where CategoryId='{catId}'");   
            }else if (subCat != null)
            {
                    sql = Query($"select * from T11223 where SubCategoryId='{subCat}'");
            }
            else
            {
                sql = Query($"select * from T11223 where isactive=1");
            }
            
            return sql;
        }

        public DataTable GetProductsBySearchText(string text)
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from T11223 where ProductName like '%{text}%'");
            return sql;
        }

        public DataTable GetAllHomeProducts()
        {
            DataTable sql = new DataTable();
            //sql = Query($"select * from T12002");
            sql = Query($"select * from T11223 where isactive=1");
            return sql;
        }

        public DataTable GetProDetailsById(string ProductId)
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from T11223 where ProductId='{ProductId}'");
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

        // public DataTable GetSearchTextData(string RoleCode)
        //{
        //    DataTable sql = new DataTable();
        //    sql = Query($"select * from T11996 where RoleCode={RoleCode}");
        //    return sql;
        //}
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

        public OrderResult OrderPlacedSaved(OrderInformation_T11224 model, List<OrderItems_T11225> list, string userCode)
        {
            var result = new OrderResult { Success = false, OrderId = 0 };

            try
            {
                BeginTransaction(); // ✅ CommonDAL এর নিজের মেথড

                Command("EXEC sp_set_session_context @key, @value", new[]
                {
            new SqlParameter("@key", "ChangedBy"),
            new SqlParameter("@value", userCode)
        });

                string queryT11224 = @"
    INSERT INTO T11224
    (CustomerID, OrderDate, OrderStatus, PaymentStatus, PaymentMethod, ShippingAddress, TotalAmount, ShippingCost, CreatedAt, RecipientPhone, RecipientName)
    VALUES
    (@CustomerID, @OrderDate, @OrderStatus, @PaymentStatus, @PaymentMethod, @ShippingAddress, @TotalAmount, @ShippingCost, @CreatedAt, @RecipientPhone, @RecipientName);
    SELECT SCOPE_IDENTITY();";

                var orderIdObj = ExecuteScalar(queryT11224, new[]
                {
    new SqlParameter("@CustomerID", Convert.ToInt32(userCode)),
    new SqlParameter("@OrderDate", DateTime.Now),
    new SqlParameter("@OrderStatus", "Pending"),        // ✅ ফিক্স
    new SqlParameter("@PaymentStatus",
        model.PaymentMethod == "COD" ? "Unpaid" : "Pending"),  // ✅ ফিক্স
    new SqlParameter("@PaymentMethod", (object)model.PaymentMethod ?? DBNull.Value),
    new SqlParameter("@ShippingAddress", (object)model.ShippingAddress ?? DBNull.Value),
    new SqlParameter("@TotalAmount", model.TotalAmount),   // GrandTotal বাদ, computed column
    new SqlParameter("@ShippingCost", model.ShippingCost),
    new SqlParameter("@CreatedAt", DateTime.Now),
    new SqlParameter("@RecipientPhone", (object)model.RecipientPhone ?? DBNull.Value),
    new SqlParameter("@RecipientName", (object)model.RecipientName ?? DBNull.Value)
});

                result.OrderId = Convert.ToInt32(orderIdObj);

                foreach (var item in list)
                {
                    Command(@"INSERT INTO T11225 (OrderID, ProductID, Quantity, UnitPrice)
                      VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice)", new[]
                    {
                new SqlParameter("@OrderID", result.OrderId),
                new SqlParameter("@ProductID", item.ProductID),
                new SqlParameter("@Quantity", item.Quantity),
                new SqlParameter("@UnitPrice", item.UnitPrice)
            });

                    // ============================================================
                    // অর্ডার হওয়ার সাথে সাথে প্রোডাক্টের স্টক কমানো + T11227-এ
                    // মুভমেন্ট লগ করা (আগে এই স্টেপটা ছিল না, তাই checkout হলেও
                    // StockQuantity অপরিবর্তিত থাকত)
                    // ============================================================
                    var currentStockObj = ExecuteScalar(
                        "SELECT StockQuantity FROM T11223 WHERE ProductId = @ProductID",
                        new[] { new SqlParameter("@ProductID", item.ProductID) });

                    int previousStock = currentStockObj != null && currentStockObj != DBNull.Value
                        ? Convert.ToInt32(currentStockObj)
                        : 0;
                    int newStock = previousStock - item.Quantity; // ইচ্ছাকৃতভাবে negative-ও হতে দেওয়া হচ্ছে, যাতে over-sell ধরা পড়ে (UI-তে আলাদাভাবে stock চেক করে আটকানো উচিত)

                    Command(@"UPDATE T11223 SET StockQuantity = @NewStock, UpdatedAt = @UpdatedAt
                              WHERE ProductId = @ProductID", new[]
                    {
                        new SqlParameter("@NewStock", newStock),
                        new SqlParameter("@UpdatedAt", DateTime.Now),
                        new SqlParameter("@ProductID", item.ProductID)
                    });

                    Command(@"INSERT INTO T11227 (ProductID, ChangeType, Quantity, Reason, PreviousStock, NewStock, ChangedAt, ChangedBy)
                              VALUES (@ProductID, 'OUT', @Quantity, @Reason, @PreviousStock, @NewStock, @ChangedAt, @ChangedBy)", new[]
                    {
                        new SqlParameter("@ProductID", item.ProductID),
                        new SqlParameter("@Quantity", item.Quantity),
                        new SqlParameter("@Reason", "Order #" + result.OrderId),
                        new SqlParameter("@PreviousStock", previousStock),
                        new SqlParameter("@NewStock", newStock),
                        new SqlParameter("@ChangedAt", DateTime.Now),
                        new SqlParameter("@ChangedBy", (object)userCode ?? DBNull.Value)
                    });
                }

                CommitTransaction(); // ✅ CommonDAL এর মেথড
                result.Success = true;
                result.Message = "Order Placed Successfully";
            }
            catch (Exception ex)
            {
                RollbackTransaction(); // ✅ CommonDAL এর মেথড
                result.Success = false;
                result.Message = ex.Message;
            }

            return result;
        }


        public InvoiceViewModel GetOrderInvoice(int orderId, string userCode)
        {
            // Order + যে ইউজার এই অর্ডারটা করেছে, তার তথ্য একসাথে জয়েন করে আনা হচ্ছে
            string orderQuery = @"
        SELECT o.OrderID, o.OrderDate, o.RecipientName, o.RecipientPhone,
               o.PaymentMethod, o.ShippingAddress, o.TotalAmount, o.ShippingCost,
               u.Username, u.Email, u.FirstName, u.LastName
        FROM T11224 o
        INNER JOIN T11999 u ON u.UserCode = o.CustomerID
        WHERE o.OrderID = @OrderID AND o.CustomerID = @CustomerID";

            var dtOrder = Query(orderQuery, new[]
            {
        new SqlParameter("@OrderID", orderId),
        new SqlParameter("@CustomerID", Convert.ToInt32(userCode))
    });

            // অর্ডার না পেলে, অথবা এটা অন্য কারো অর্ডার হলে — null রিটার্ন (security check)
            if (dtOrder.Rows.Count == 0) return null;

            var row = dtOrder.Rows[0];
            var model = new InvoiceViewModel
            {
                OrderID = Convert.ToInt32(row["OrderID"]),
                OrderDate = Convert.ToDateTime(row["OrderDate"]),
                RecipientName = row["RecipientName"].ToString(),
                RecipientPhone = row["RecipientPhone"].ToString(),
                PaymentMethod = row["PaymentMethod"].ToString(),
                ShippingAddress = row["ShippingAddress"].ToString(),
                TotalAmount = Convert.ToDecimal(row["TotalAmount"]),
                ShippingCost = Convert.ToDecimal(row["ShippingCost"]),
                CustomerUsername = row["Username"].ToString(),
                CustomerEmail = row["Email"].ToString(),
                CustomerFullName = row["FirstName"].ToString() + " " + row["LastName"].ToString()
            };

            string itemsQuery = @"
        SELECT oi.Quantity, oi.UnitPrice, p.ProductName
        FROM T11225 oi
        INNER JOIN T11223 p ON p.ProductId = oi.ProductID
        WHERE oi.OrderID = @OrderID";

            var dtItems = Query(itemsQuery, new[] { new SqlParameter("@OrderID", orderId) });

            foreach (DataRow r in dtItems.Rows)
            {
                var qty = Convert.ToInt32(r["Quantity"]);
                var price = Convert.ToDecimal(r["UnitPrice"]);
                model.Items.Add(new InvoiceItem
                {
                    ProductName = r["ProductName"].ToString(),
                    Quantity = qty,
                    UnitPrice = price,
                    TotalPrice = qty * price
                });
            }

            return model;
        }

    }
}
