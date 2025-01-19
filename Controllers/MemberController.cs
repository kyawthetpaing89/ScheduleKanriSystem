using Microsoft.AspNetCore.Mvc;

namespace ScheduleKanriSystem.Controllers
{
    [Route("{tenantId}/Member")]
    public class MemberController(IConfiguration configuration) : BaseController(configuration)
    {
        public IActionResult MemberLogin()
        {
            return View();
        }
    }
}
