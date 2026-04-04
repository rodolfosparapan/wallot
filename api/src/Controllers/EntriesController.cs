using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WallotApi.Models.DTOs.Entries;
using WallotApi.Services.Interfaces;

namespace WallotApi.Controllers;

[ApiController]
[Route("api/entries")]
[Authorize]
public class EntriesController : ControllerBase
{
    private readonly IEntryService _entryService;

    public EntriesController(IEntryService entryService) => _entryService = entryService;

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<EntryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<EntryDto>>> GetEntries([FromQuery] EntryQueryParams query)
    {
        var result = await _entryService.GetEntriesAsync(CurrentUserId, query);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(EntryDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<EntryDto>> CreateEntry([FromBody] CreateEntryRequest req)
    {
        var entry = await _entryService.CreateAsync(CurrentUserId, req);
        return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, entry);
    }

    [HttpGet("summary")]
    [ProducesResponseType(typeof(MonthSummaryDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MonthSummaryDto>> GetSummary([FromQuery] string month)
    {
        var parts = month?.Split('-');
        if (parts?.Length != 2 || !int.TryParse(parts[0], out int year) || !int.TryParse(parts[1], out int monthNum))
            return BadRequest(new { message = "Invalid month format. Use YYYY-MM." });

        var result = await _entryService.GetMonthSummaryAsync(CurrentUserId, year, monthNum);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(EntryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EntryDto>> GetEntry(string id)
    {
        var entry = await _entryService.GetByIdAsync(CurrentUserId, id);
        if (entry == null) return NotFound();
        return Ok(entry);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(EntryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EntryDto>> UpdateEntry(string id, [FromBody] UpdateEntryRequest req)
    {
        var entry = await _entryService.UpdateAsync(CurrentUserId, id, req);
        if (entry == null) return NotFound();
        return Ok(entry);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEntry(string id)
    {
        var deleted = await _entryService.DeleteAsync(CurrentUserId, id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
