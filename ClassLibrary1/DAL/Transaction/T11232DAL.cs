using ClassLibrary1.Models;
using DataAccessLayer.Common;
using System;
using System.Data;
using System.Data.SqlClient;

namespace ClassLibrary1.DAL.Transaction
{
    public class T11232DAL : CommonDAL
    {
        // ============================================================
        // সব অ্যাক্টিভ প্রোডাক্ট + তাদের বর্তমান স্টক পরিমাণ
        // ============================================================
        public DataTable GetProductStockList()
        {
            return Query($@"
                SELECT ProductId, ProductName, SKU, ImageUrl, Unit,
                       Price, StockQuantity
                FROM T11223
                WHERE IsActive = 1
                ORDER BY ProductName");
        }

        // ============================================================
        // স্টক Add/Reduce করা — একই সাথে T11227-এ মুভমেন্ট লগ করা হয়,
        // এবং স্টক যাতে কখনো নেগেটিভ না হয়ে যায় তা নিশ্চিত করা হয়
        // ============================================================
        public OrderResult AdjustStock(int productId, string changeType, int quantity, string reason, string changedBy)
        {
            var result = new OrderResult { Success = false, OrderId = productId };

            if (quantity <= 0)
            {
                result.Message = "পরিমাণ অবশ্যই শূন্যের বেশি হতে হবে।";
                return result;
            }

            try
            {
                BeginTransaction();

                var currentStockObj = ExecuteScalar(
                    "SELECT StockQuantity FROM T11223 WHERE ProductId = @ProductID",
                    new[] { new SqlParameter("@ProductID", productId) });

                if (currentStockObj == null || currentStockObj == DBNull.Value)
                {
                    RollbackTransaction();
                    result.Message = "প্রোডাক্ট খুঁজে পাওয়া যায়নি।";
                    return result;
                }

                int previousStock = Convert.ToInt32(currentStockObj);
                int newStock = changeType == "IN"
                    ? previousStock + quantity
                    : previousStock - quantity;

                if (newStock < 0)
                {
                    RollbackTransaction();
                    result.Message = $"বর্তমান স্টক ({previousStock}) থেকে {quantity} ইউনিট কমানো যাবে না।";
                    return result;
                }

                Command(@"UPDATE T11223 SET StockQuantity = @NewStock, UpdatedAt = @UpdatedAt
                          WHERE ProductId = @ProductID", new[]
                {
                    new SqlParameter("@NewStock", newStock),
                    new SqlParameter("@UpdatedAt", DateTime.Now),
                    new SqlParameter("@ProductID", productId)
                });

                Command(@"INSERT INTO T11227 (ProductID, ChangeType, Quantity, Reason, PreviousStock, NewStock, ChangedAt, ChangedBy)
                          VALUES (@ProductID, @ChangeType, @Quantity, @Reason, @PreviousStock, @NewStock, @ChangedAt, @ChangedBy)", new[]
                {
                    new SqlParameter("@ProductID", productId),
                    new SqlParameter("@ChangeType", changeType),
                    new SqlParameter("@Quantity", quantity),
                    new SqlParameter("@Reason", (object)reason ?? DBNull.Value),
                    new SqlParameter("@PreviousStock", previousStock),
                    new SqlParameter("@NewStock", newStock),
                    new SqlParameter("@ChangedAt", DateTime.Now),
                    new SqlParameter("@ChangedBy", (object)changedBy ?? DBNull.Value)
                });

                CommitTransaction();
                result.Success = true;
                result.Message = "স্টক সফলভাবে আপডেট হয়েছে";
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
        // একটা নির্দিষ্ট প্রোডাক্টের সব স্টক-মুভমেন্ট হিস্টোরি
        // ============================================================
        public DataTable GetStockMovementHistory(int productId)
        {
            return Query(@"SELECT ChangeType, Quantity, Reason, PreviousStock, NewStock, ChangedBy,
                            FORMAT(ChangedAt,'dd MMM yyyy, hh:mm tt') ChangedAt_Text
                            FROM T11227
                            WHERE ProductID = @ProductID
                            ORDER BY ChangedAt DESC", new[]
            {
                new SqlParameter("@ProductID", productId)
            });
        }
    }
}