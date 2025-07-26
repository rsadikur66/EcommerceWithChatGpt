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

        public DataTable GetFormsData()
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from T11996 where RoleCode=120;");
            return sql;
        }
    }
}
