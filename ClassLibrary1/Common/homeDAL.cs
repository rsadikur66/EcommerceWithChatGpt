using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Common
{
    public class homeDAL : CommonDAL
    {
        public DataTable GetCatData()
        {
            DataTable sql = new DataTable();
            sql = Query($"select c.categoryid,c.name from T12000 c");
            return sql;
        }
        public DataTable GetSubCatData(string catId)
        {
            DataTable sql = new DataTable();
            sql = Query($"select s.SubCategoryId,s.Name From T12001 s where s.CategoryId='{catId}'");
            return sql;
        }

         public DataTable GetAllHomeProducts()
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from T12002");
            return sql;
        }





        public DataTable GetProDetailsById(string ProductId)
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from t12002 where product_id='{ProductId}'");
            return sql;
        }
    }
}
