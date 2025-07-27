using DataAccessLayer.Common;
using System.Data;

namespace ClassLibrary1.DAL.Setup
{
    public class T11224DAL:CommonDAL
    {
        public DataTable GetAllProducts()
        {
            DataTable dt = new DataTable();
             dt = Query($@"SELECT * FROM T11223");
            return dt;
        }

    }
}
