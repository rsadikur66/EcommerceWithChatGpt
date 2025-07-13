using DataAccessLayer.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary1.DAL.Setup
{
    public class T11221DAL : CommonDAL
    {
        public DataTable GetCategoryList()
        {
            return Query($"SELECT * FROM T11221");
        }
    }
}
