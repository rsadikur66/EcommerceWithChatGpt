using ClassLibrary1.Models;
using DataAccessLayer.Common;
using System;
using System.Data;
using System.Data.SqlClient;

namespace ClassLibrary1.DAL.Transaction
{
    public class T11231DAL : CommonDAL
    {
        public DataTable GetOrdersList()
        {
            return Query($@"SELECT t24.OrderID,
                FORMAT(t24.OrderDate,'dd-MM-yyyy HH:mm tt') OrderDate_Time,
                t24.ShippingAddress,t24.RecipientName,t24.RecipientPhone,
                t24.GrandTotal,t24.OrderStatus,t24.PaymentStatus
                FROM T11224 t24 ORDER BY t24.OrderID DESC");
        }

        // ============================================================
        // Admin/Owner view — homeDAL.GetOrderInvoice(orderId, userCode) এর
        // মতোই, কিন্তু "o.CustomerID = @CustomerID" ওনারশিপ-চেক ছাড়া, যাতে
        // অ্যাডমিন যেকোনো কাস্টমারের যেকোনো অর্ডারের ইনভয়েস দেখতে পারে।
        // ============================================================
        public InvoiceViewModel GetOrderInvoiceForAdmin(int orderId)
        {
            string orderQuery = @"
        SELECT o.OrderID, o.OrderDate, o.RecipientName, o.RecipientPhone,
               o.PaymentMethod, o.ShippingAddress, o.TotalAmount, o.ShippingCost,
               u.Username, u.Email, u.FirstName, u.LastName
        FROM T11224 o
        INNER JOIN T11999 u ON u.UserCode = o.CustomerID
        WHERE o.OrderID = @OrderID";

            var dtOrder = Query(orderQuery, new[]
            {
                new SqlParameter("@OrderID", orderId)
            });

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

        public DataTable GetOrderDetailsReportData()
        {
            return Query($"");
        }

        // ============================================================
        // Order Status Update — T11224.OrderStatus আপডেট করে এবং একই
        // সাথে T11226 (OrderHistory) টেবিলে একটা টাইমলাইন এন্ট্রি লগ করে
        // ============================================================
        public OrderResult UpdateOrderStatus(int orderId, string newStatus, string changedBy)
        {
            var result = new OrderResult { Success = false, OrderId = orderId };

            try
            {
                BeginTransaction();

                Command(@"UPDATE T11224 SET OrderStatus = @Status, UpdatedAt = @UpdatedAt WHERE OrderID = @OrderID", new[]
                {
                    new SqlParameter("@Status", newStatus),
                    new SqlParameter("@UpdatedAt", DateTime.Now),
                    new SqlParameter("@OrderID", orderId)
                });

                Command(@"INSERT INTO T11226 (OrderID, Status, ChangedAt, ChangedBy)
                          VALUES (@OrderID, @Status, @ChangedAt, @ChangedBy)", new[]
                {
                    new SqlParameter("@OrderID", orderId),
                    new SqlParameter("@Status", newStatus),
                    new SqlParameter("@ChangedAt", DateTime.Now),
                    new SqlParameter("@ChangedBy", (object)changedBy ?? DBNull.Value)
                });

                CommitTransaction();
                result.Success = true;
                result.Message = "Order status updated successfully";
            }
            catch (Exception ex)
            {
                RollbackTransaction();
                result.Success = false;
                result.Message = ex.Message;
            }

            return result;
        }

        // ============================================================
        // একটা নির্দিষ্ট অর্ডারের সব স্ট্যাটাস-চেঞ্জ হিস্টোরি (টাইমলাইন)
        // ============================================================
        public DataTable GetOrderStatusHistory(int orderId)
        {
            return Query(@"SELECT Status, ChangedBy,
                            FORMAT(ChangedAt,'dd MMM yyyy, hh:mm tt') ChangedAt_Text
                            FROM T11226
                            WHERE OrderID = @OrderID
                            ORDER BY ChangedAt DESC", new[]
            {
                new SqlParameter("@OrderID", orderId)
            });
        }
    }
}
