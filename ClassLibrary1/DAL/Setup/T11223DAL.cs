using ClassLibrary1.Models;
using DataAccessLayer.Common;
using System.Data;

namespace ClassLibrary1.DAL.Setup
{
    public class T11223DAL : CommonDAL
    {
        public DataTable GetSubCategoryList(int CategoryId)
        {
            return Query($"SELECT * FROM T11222 WHERE CategoryId = {CategoryId}");
        }


        public string SaveData(T11223 t11223)
        {
            string query = $@"INSERT INTO T11223(ProductName, CategoryId, SubCategoryId, Price, ProductDescription, ImageUrl,StockQuantity,IsActive, CreatedAt) VALUES ('{t11223.Name}', {t11223.CategoryId}, {t11223.SubCategoryId}, {t11223.Price}, '{t11223.Description}', '{t11223.ImagePath}',50,1, GETDATE())";

            bool result = Command(query);
            return result ? "success" : "Failed";
        }

    }
}
