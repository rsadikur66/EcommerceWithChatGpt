using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary1.Models
{
    // ============================================================
    // অ্যাডমিন যখন প্রোডাক্টের স্টক ম্যানুয়ালি Add/Reduce করে, সেই
    // রিকোয়েস্ট বহন করার জন্য
    // ============================================================
    public class StockAdjustRequest
    {
        public int ProductID { get; set; }
        public string ChangeType { get; set; }   // "IN" অথবা "OUT"
        public int Quantity { get; set; }
        public string Reason { get; set; }
    }
}
