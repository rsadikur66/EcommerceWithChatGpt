using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Common
{
    public class CommonDAL
    {
        protected SqlTransaction _sqlTransaction;
        protected readonly SqlConnection _sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString);
        public void BeginTransaction()
        {
            if (_sqlConnection.State != ConnectionState.Open)
                _sqlConnection.Open();
            _sqlTransaction = _sqlConnection.BeginTransaction();
        }
        public void CommitTransaction()
        {
            _sqlTransaction.Commit();
        }

        public void RollbackTransaction()
        {
            _sqlTransaction.Rollback();
        }
        public bool Command(string command)
        {
            if (_sqlConnection.State != ConnectionState.Open)
                _sqlConnection.Open();
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandText = command,
                Transaction = _sqlTransaction   // ✅ fix: transaction bound হলে attach হবে
            };
            return sqlCommand.ExecuteNonQuery() > 0;
        }
        // ✅ নতুন parameterized overload
        public bool Command(string command, SqlParameter[] parameters)
        {
            if (_sqlConnection.State != ConnectionState.Open)
                _sqlConnection.Open();
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandText = command,
                Transaction = _sqlTransaction
            };
            if (parameters != null) sqlCommand.Parameters.AddRange(parameters);
            return sqlCommand.ExecuteNonQuery() > 0;
        }
        // ✅ নতুন parameterized ExecuteScalar (transaction-aware)
        public object ExecuteScalar(string query, SqlParameter[] parameters)
        {
            if (_sqlConnection.State != ConnectionState.Open)
                _sqlConnection.Open();
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandText = query,
                Transaction = _sqlTransaction
            };
            if (parameters != null) sqlCommand.Parameters.AddRange(parameters);
            return sqlCommand.ExecuteScalar();
        }
        public bool Command_1(string command)
        {
            // var strConnString = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString); // get it from Web.config file    
            SqlTransaction objTrans = null;

            using (SqlConnection objConn = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString))
            {
                objConn.Open();
                objTrans = objConn.BeginTransaction();
                SqlCommand objCmd1 = new SqlCommand(command, objConn);
                // SqlCommand objCmd2 = new SqlCommand("insert into tblProjectMember(MemberID, ProjectID) values(2, 1)", objConn);
                try
                {
                    objCmd1.ExecuteNonQuery();
                    // objCmd2.ExecuteNonQuery(); // Throws exception due to foreign key constraint   
                    objTrans.Commit();
                }
                catch (Exception)
                {
                    objTrans.Rollback();
                }
                finally
                {
                    objConn.Close();
                }
            }
            return true;
            //var  _sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString);
            //var sqlCommand = new SqlCommand
            //{
            //    Connection = _sqlConnection,
            //    CommandText = command
            //};
            //return sqlCommand.ExecuteNonQuery() > 0;
        }

        public bool command_2(string query, SqlConnection objConn, SqlTransaction objTrans)
        {
            SqlCommand objCmd2 = new SqlCommand(query, objConn, objTrans);
            objCmd2.ExecuteNonQuery();
            return true;
        }
        public DataTable Query_2(string query, SqlConnection objConn, SqlTransaction objTrans)
        {
            // SqlCommand command = new SqlCommand("SELECT MAX(VOUCHER_MASTER_ID)VOUCHER_MASTER_ID FROM AT13001", objConn, objTrans);
            SqlCommand sqlCommand = new SqlCommand(query, objConn, objTrans);
            var sqlDataAdapter = new SqlDataAdapter(sqlCommand);
            var dataTable = new DataTable();
            sqlDataAdapter.Fill(dataTable);
            return dataTable;
        }
        public DataTable Query(string query)
        {
            var SqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString);
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandText = query
            };
            var sqlDataAdapter = new SqlDataAdapter(sqlCommand);
            var dataTable = new DataTable();

            sqlDataAdapter.Fill(dataTable);
            return dataTable;
        }

        public DataTable Query(string query, SqlParameter[] parameters)
        {
            if (_sqlConnection.State != ConnectionState.Open)
                _sqlConnection.Open();

            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandText = query,
                Transaction = _sqlTransaction
            };
            if (parameters != null) sqlCommand.Parameters.AddRange(parameters);

            var sqlDataAdapter = new SqlDataAdapter(sqlCommand);
            var dataTable = new DataTable();
            sqlDataAdapter.Fill(dataTable);
            return dataTable;
        }
        public DataTable ExecuteSelectWithoutParam(String procedureName)
        {
            var sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString);
            var sqlCommand = new SqlCommand
            {
                Connection = sqlConnection,
                CommandType = CommandType.StoredProcedure,
                CommandText = procedureName
            };
            //sqlCommand.Parameters.Add("P_RECORDSET", SqlDbType.Variant).Direction = ParameterDirection.Output; // Variant e problem hote pare 
            var sqlDataAdapter = new SqlDataAdapter(sqlCommand);
            var dataTable = new DataTable();
            sqlDataAdapter.Fill(dataTable);
            return dataTable;
        }
        public void LogError(String T_ERROR_MESSAGE)
        {
            var sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["OrclCon"].ConnectionString);
            var sqlCommand = new SqlCommand
            {
                Connection = sqlConnection,
                CommandType = CommandType.StoredProcedure,
                CommandText = "T11111_INSERT"
            };
            sqlConnection.Open();
            sqlCommand.ExecuteNonQuery();
            sqlCommand.Dispose();
            sqlConnection.Close();
            sqlConnection.Dispose();
        }
        public Boolean ExecuteProcedureForGrid(String procedureName, SqlParameter[] parameters)
        {
            var procedureOutput = new List<string>();
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandType = CommandType.StoredProcedure,
                CommandText = procedureName
            };
            sqlCommand.Parameters.AddRange(parameters);

            var outputParameters = new[]
            {
         new SqlParameter("ProcedureResult", 0)
       // new SqlParameter("ProcedureResult", SqlDbType.NVarChar, 100,null, ParameterDirection.Output)
    };
            sqlCommand.Parameters.AddRange(outputParameters);
            _sqlConnection.Open();
            sqlCommand.ExecuteNonQuery();
            _sqlConnection.Close();
            procedureOutput.AddRange(from op in outputParameters select op.Value.ToString());
            return Convert.ToBoolean(Convert.ToInt16(procedureOutput[0]));
        }
        public Boolean ExecuteProcedure(String procedureName, SqlParameter[] parameters)
        {
            var procedureOutput = new List<string>();
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandType = CommandType.StoredProcedure,
                CommandText = procedureName
            };
            sqlCommand.Parameters.AddRange(parameters);

            var outputParameters = new[]
            {
         new SqlParameter("ProcedureResult", 0)
       // new OracleParameter("ProcedureResult", OracleDbType.NVarchar2, 100, null, ParameterDirection.Output)
    };
            sqlCommand.Parameters.AddRange(outputParameters);
            _sqlConnection.Open();
            sqlCommand.ExecuteNonQuery();
            //_oracleConnection.Dispose();
            _sqlConnection.Close();
            procedureOutput.AddRange(from op in outputParameters select op.Value.ToString());
            return Convert.ToBoolean(Convert.ToInt16(procedureOutput[0]));
        }
        public DataTable ExecuteSelectProcedure(String procedureName, SqlParameter[] parameters)
        {
            // var oracleConnection = new OracleConnection(ConfigurationManager.ConnectionStrings["OrclCon"].ConnectionString);
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandType = CommandType.StoredProcedure,
                CommandText = procedureName
            };
            sqlCommand.Parameters.AddRange(parameters);
            sqlCommand.Parameters.Add("P_RECORDSET", SqlDbType.Variant).Direction = ParameterDirection.Output;
            var sqlDataAdapter = new SqlDataAdapter(sqlCommand);
            var dataTable = new DataTable();
            sqlDataAdapter.Fill(dataTable);
            return dataTable;
        }
        public Boolean ExecuteIProcedure(String procedureName, SqlParameter[] parameters)
        {
            // var oracleConnection = new OracleConnection(ConfigurationManager.ConnectionStrings["OrclCon"].ConnectionString);
            var procedureOutput = new List<string>();
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandType = CommandType.StoredProcedure,
                CommandText = procedureName
            };
            sqlCommand.Parameters.AddRange(parameters);
            sqlCommand.ExecuteNonQuery();
            // procedureOutput.AddRange(from op in 1 select op.Value.ToString());
            return Convert.ToBoolean(Convert.ToInt16(0));
        }
        public DataTable ExecuteSelectProcedure(String procedureName)
        {
            //var oracleConnection = new OracleConnection(ConfigurationManager.ConnectionStrings["OrclCon"].ConnectionString);
            var sqlCommand = new SqlCommand
            {
                Connection = _sqlConnection,
                CommandType = CommandType.StoredProcedure,
                CommandText = procedureName
            };
            sqlCommand.Parameters.Add("P_RECORDSET", SqlDbType.Variant).Direction = ParameterDirection.Output;
            var oracleDataAdapter = new SqlDataAdapter(sqlCommand);
            var dataTable = new DataTable();
            oracleDataAdapter.Fill(dataTable);
            return dataTable;
        }
        public object ExecuteScalar(string query)
        {
            // Connection string নেবো Configuration থেকে
            string connString = ConfigurationManager.ConnectionStrings["SqlCon"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    return cmd.ExecuteScalar();
                }
            }
        }


        public bool permission(string roll, string form, string mod)
        {
            //Boolean result = false;
            var res = "0";
            if (mod == "INS")
            {
                res = Query($"SELECT COUNT(*)T_COUNT FROM T10000 where T_FORM_CODE ='{form}' AND T_ROLE ='{roll}' AND T_INSERT ='1'").Rows[0]["T_COUNT"].ToString();

            }
            else if (mod == "UPD")
            {
                res = Query($"SELECT COUNT(*)T_COUNT FROM T10000 where T_FORM_CODE ='{form}' AND T_ROLE ='{roll}' AND T_UPDATE ='1'").Rows[0]["T_COUNT"].ToString();

            }
            else if (mod == "DEL")
            {
                res = Query($"SELECT COUNT(*)T_COUNT FROM T10000 where T_FORM_CODE ='{form}' AND T_ROLE ='{roll}' AND T_DELETE ='1'").Rows[0]["T_COUNT"].ToString();

            }
            if (res == "1") { return true; } else { return false; }

        }

    }
}
