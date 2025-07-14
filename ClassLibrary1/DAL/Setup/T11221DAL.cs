using ClassLibrary1.Models;
using DataAccessLayer.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary1.DAL.Setup
{
    public class T11221DAL : CommonDAL
    {
        public DataTable GetCategoryList()
        {
            return Query($"SELECT * FROM T12000");
        }

        public string SaveData(T11221 t11221, string user)
        {
            var sms = "";
            //var date = DateTime.Now.ToString("dd-MM-yyyy");
            //SqlTransaction objTrans = null;

            //using (SqlConnection objConn = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString))
            //{

            //    try
            //    {
            //        objConn.Open();
            //        objTrans = objConn.BeginTransaction();
            //        foreach (var i in t14027)
            //        {
            //            var update_26 = $"UPDATE T14026 SET T_RECEIVE_FLAG='{i.T_RECEIVE_FLAG}', T_UPDATE_USER ='{user}',T_UPDATE_DATE='{date}' WHERE T_ORDER_CODE ='{i.T_ORDER_CODE}'";
            //            command_2(update_26, objConn, objTrans);
            //            var update_50 = $"UPDATE T14050 SET T_RECEIVE_FLAG='{i.T_RECEIVE_FLAG}', T_UPDATE_USER ='{user}',T_UPDATE_DATE='{date}' WHERE T_ORDER_CODE ='{i.T_ORDER_CODE}'";
            //            command_2(update_50, objConn, objTrans);
            //        }
            //        objTrans.Commit();
            //        sms = "Save Successfully-1";
            //    }
            //    catch (Exception ex)
            //    {
            //        var kk = ex.Message;
            //        sms = "Do not Save-0";
            //        objTrans.Rollback();
            //    }
            //    finally
            //    {
            //        objConn.Close();
            //    }
            //}

            return sms;
        }
    }
}
