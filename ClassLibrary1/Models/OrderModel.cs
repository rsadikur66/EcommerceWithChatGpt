using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary1.Models
{
    public class OrderModel
    {
        OrderInformation_T11224 customerInfo { get; set; }
        List<OrderItems_T11225> orderItems { get; set; }
    }

    public class InvoiceViewModel
    {
        public int OrderID { get; set; }
        public DateTime OrderDate { get; set; }
        public string RecipientName { get; set; }
        public string RecipientPhone { get; set; }
        public string PaymentMethod { get; set; }
        public string ShippingAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal GrandTotal => TotalAmount + ShippingCost;

        // লগইন করা ইউজারের নিজের তথ্য
        public string CustomerFullName { get; set; }
        public string CustomerUsername { get; set; }
        public string CustomerEmail { get; set; }

        public List<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
    }

    public class InvoiceItem
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class OrderResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int OrderId { get; set; }
    }

    public class OrderStatusUpdateRequest
    {
        public int OrderID { get; set; }
        public string Status { get; set; }
    }
    public class OrderInformation_T11224
    {
        public int OrderID { get; set; }
        public int CustomerID { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentStatus { get; set; }
        public string RecipientPhone { get; set; }
        public string RecipientName { get; set; }
        public string PaymentMethod { get; set; }
        public string ShippingAddress { get; set; }
        public string BillingAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal GrandTotal { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class OrderItems_T11225
    {
        public int OrderItemID { get; set; }
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    //    OrderID
    //OrderItemID
    //ProductID
    //Quantity
    //TotalPrice
    //UnitPrice
}
