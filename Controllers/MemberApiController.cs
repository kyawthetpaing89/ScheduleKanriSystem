using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScheduleKanriSystem.Data;
using ScheduleKanriSystem.Models;
using ScheduleKanriSystem.Utilities;

namespace ScheduleKanriSystem.Controllers
{
    [Route("/api/member/")]
    [ApiController]
    public class MemberApiController(IGenericRepository<MemberModel> repo, JwtService jwtService) : ControllerBase
    {
        private readonly IGenericRepository<MemberModel> _memberRepo = repo;
        private readonly JwtService _jwtService = jwtService;

        [HttpPost("logincheck")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> LoginCheck(MemberModel member)
        {
            var parameters = member.GetParam_LoginCheck();
            ApiResponseModel response = await _memberRepo.ExecAsync("Member_LoginCheck", parameters, false);

            if (response.StatusCode == 200 && response?.Data is IEnumerable<dynamic> data && data.Any())
            {
                var userData = data.FirstOrDefault();
                var tenantId = userData?.TenantID;
                var userId = userData?.UserID;

                var token = _jwtService.GenerateToken(tenantId + '-' + userId,tenantId);
                return Ok(new
                {
                    StatusCode = 200,
                    Token = token,
                    Data = userData 
                });
            }
            else
            {
                return Unauthorized(new ApiResponseModel
                {
                    StatusCode = 401,
                    Data = new
                    {
                        Message = "Login Failed! Email or password incorrect."
                    }
                });
            }
        }

        [Authorize]
        [HttpPost("getmember")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> MemberSelect(MemberModel member)
        {
            var parameters = member.GetParam_MemberSelect();
            ApiResponseModel response = await _memberRepo.ExecAsync("Member_Select", parameters, false);

            return Ok(response);
        }
    }
}
