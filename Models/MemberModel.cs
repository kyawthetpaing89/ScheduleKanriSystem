using Dapper;

namespace ScheduleKanriSystem.Models
{
    public class MemberModel : TenantModel
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? Position { get; set; }
        public string? MoblieNumber { get; set; }

        public DynamicParameters GetParam_CreateWorkSpace()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TenantID", TenantID);
            parameters.Add("@CompanyName", CompanyName);
            parameters.Add("@UserName", UserName);
            parameters.Add("@Email", Email);
            parameters.Add("@Password", Password);
            parameters.Add("@Position", Position);
            parameters.Add("@MobileNumber", MoblieNumber);

            return parameters;
        }

        public DynamicParameters GetParam_LoginCheck()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TenantID", TenantID);
            parameters.Add("@Email", Email);
            parameters.Add("@Password", Password);

            return parameters;
        }

        public DynamicParameters GetParam_MemberSelect()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TenantID", TenantID);
            parameters.Add("@UserName", UserName);

            return parameters;
        }
    }
}
