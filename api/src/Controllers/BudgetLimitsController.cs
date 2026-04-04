using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WallotApi.Models.DTOs.BudgetLimits;
using WallotApi.Services.Interfaces;

namespace WallotApi.Controllers;

[ApiController]
[Route("api/budget-limits")]
[Authorize]
public class BudgetLimitsController : ControllerBase
{
    private readonly IBudgetLimitService _budgetLimitService;

    public BudgetLimitsController(IBudgetLimitService budgetLimitService) => _budgetLimitService = budgetLimitService;

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    [ProducesResponseType(typeof(List<BudgetLimitDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<BudgetLimitDto>>> GetAll()
    {
        var result = await _budgetLimitService.GetAllAsync(CurrentUserId);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(BudgetLimitDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<BudgetLimitDto>> Create([FromBody] CreateBudgetLimitRequest req)
    {
        var limit = await _budgetLimitService.CreateAsync(CurrentUserId, req);
        return CreatedAtAction(nameof(GetAll), new { id = limit.Id }, limit);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(BudgetLimitDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BudgetLimitDto>> Update(string id, [FromBody] UpdateBudgetLimitRequest req)
    {
        var limit = await _budgetLimitService.UpdateAsync(CurrentUserId, id, req);
        if (limit == null) return NotFound();
        return Ok(limit);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _budgetLimitService.DeleteAsync(CurrentUserId, id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
