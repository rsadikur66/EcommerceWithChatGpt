using DataAccessLayer.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary1.Common
{
    public class loginDAL :CommonDAL
    {
        public DataTable GetData(string userName, string pass)
        {
            DataTable sql = new DataTable();
            sql = Query($"select * from T11999 where Username='{userName}' and PasswordHash='{pass}' and IsActive != 0");
            return sql;
        }
    }
}
