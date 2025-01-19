using Microsoft.AspNetCore.Mvc;

namespace ScheduleKanriSystem.Controllers
{
    public class TenantController(IConfiguration configuration) : BaseController(configuration)
    {
        public IActionResult HomePage()
        {
            return View();
        }

        public IActionResult CreateTenant()
        {
            return View();
        }
    }
}
