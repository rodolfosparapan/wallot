using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WallotApi.Models.DTOs.Insights;
using WallotApi.Services.Interfaces;

namespace WallotApi.Controllers;

[ApiController]
[Route("api/insights")]
[Authorize]
public class InsightsController : ControllerBase
{
    private readonly IInsightService _insightService;

    public InsightsController(IInsightService insightService) => _insightService = insightService;

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("health-score")]
    [ProducesResponseType(typeof(HealthScoreDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<HealthScoreDto>> GetHealthScore()
    {
        var result = await _insightService.GetHealthScoreAsync(CurrentUserId);
        return Ok(result);
    }

    [HttpGet("spending-trend")]
    [ProducesResponseType(typeof(List<SpendingTrendPointDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SpendingTrendPointDto>>> GetSpendingTrend([FromQuery] int months = 6)
    {
        var result = await _insightService.GetSpendingTrendAsync(CurrentUserId, months);
        return Ok(result);
    }

    [HttpGet("category-breakdown")]
    [ProducesResponseType(typeof(List<CategoryBreakdownDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<CategoryBreakdownDto>>> GetCategoryBreakdown([FromQuery] string month)
    {
        var parts = month?.Split('-');
        if (parts?.Length != 2 || !int.TryParse(parts[0], out int year) || !int.TryParse(parts[1], out int monthNum))
            return BadRequest(new { message = "Invalid month format. Use YYYY-MM." });

        var result = await _insightService.GetCategoryBreakdownAsync(CurrentUserId, year, monthNum);
        return Ok(result);
    }

    [HttpGet("chips")]
    [ProducesResponseType(typeof(List<InsightChipDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<InsightChipDto>>> GetChips([FromQuery] string month)
    {
        var parts = month?.Split('-');
        if (parts?.Length != 2 || !int.TryParse(parts[0], out int year) || !int.TryParse(parts[1], out int monthNum))
            return BadRequest(new { message = "Invalid month format. Use YYYY-MM." });

        var result = await _insightService.GetChipsAsync(CurrentUserId, year, monthNum);
        return Ok(result);
    }
}
