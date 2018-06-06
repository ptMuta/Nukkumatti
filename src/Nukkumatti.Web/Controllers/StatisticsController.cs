using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nukkumatti.Web.Data;

namespace Nukkumatti.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly NukkumattiDbContext _context;

        public StatisticsController(NukkumattiDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Statistics()
        {
            var latestSituation = await _context.Situations.LastOrDefaultAsync();
            return new ContentResult
            {
                ContentType = "text/plain",
                Content = $"nukkumatti {latestSituation?.Count ?? 0}\n",
                StatusCode = 200
            };
        }
    }
}