using Dapper;
using Microsoft.Data.SqlClient;
using ScheduleKanriSystem.Models;
using System.Data;

namespace ScheduleKanriSystem.Data
{
    public class GenericRepository<T>(IConfiguration configuration) : IGenericRepository<T> where T : BaseModel, new()
    {
        private readonly string _connectionString = configuration.GetConnectionString("LocalDB") ?? "";

        public async Task<ApiResponseModel> ExecAsync(string storeProc, object param, bool useTransaction = false)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var transaction = useTransaction ? connection.BeginTransaction() : null;

            try
            {
                var result = await connection.QueryAsync<object>(
                    storeProc,
                    param,
                    transaction: transaction,
                    commandType: CommandType.StoredProcedure
                );

                transaction?.Commit();

                return new ApiResponseModel
                {
                    StatusCode = 200,
                    Data = result
                };
            }
            catch (Exception ex)
            {
                transaction?.Rollback();

                return new ApiResponseModel
                {
                    StatusCode = 500,
                    Data = new
                    {
                        Message = ex.Message
                    }
                };
            }
        }

    }
}
