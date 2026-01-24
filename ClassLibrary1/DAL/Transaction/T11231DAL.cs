using DataAccessLayer.Common;
using System.Data;

namespace ClassLibrary1.DAL.Transaction
{
    public class T11231DAL : CommonDAL
    {
        public DataTable GetOrdersList()
        {
            return Query($"SELECT t24.OrderID,FORMAT(t24.OrderDate,'dd-MM-yyyy HH:mm tt') OrderDate_Time,t24.ShippingAddress,t24.RecipientName,t24.RecipientPhone,t24.GrandTotal from T11224 t24");
        }
    }
}
