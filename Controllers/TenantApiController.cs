using Dapper;
using Microsoft.AspNetCore.Mvc;
using ScheduleKanriSystem.Data;
using ScheduleKanriSystem.Models;

namespace ScheduleKanriSystem.Controllers
{
    [Route("/api/tenant/")]
    [ApiController]
    public class TenantApiController(IGenericRepository<MemberModel> repo) : ControllerBase
    {
        private readonly IGenericRepository<MemberModel> _tenantRepo = repo;

        [HttpPost("tenantprocess")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> TenantProcess(MemberModel member)
        {
            var parameters = member.GetParam_CreateWorkSpace();
            var result = await _tenantRepo.ExecAsync("CreateWorkspace",parameters,false);
            return Ok(result);
        }
    }
}
