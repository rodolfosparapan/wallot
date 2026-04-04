using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WallotApi.Models.DTOs.Alerts;
using WallotApi.Services.Interfaces;

namespace WallotApi.Controllers;

[ApiController]
[Route("api/alerts")]
[Authorize]
public class AlertsController : ControllerBase
{
    private readonly IAlertService _alertService;

    public AlertsController(IAlertService alertService) => _alertService = alertService;

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    [ProducesResponseType(typeof(List<AlertDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AlertDto>>> GetAll()
    {
        var result = await _alertService.GetAllAsync(CurrentUserId);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(AlertDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AlertDto>> Update(string id, [FromBody] UpdateAlertRequest req)
    {
        var alert = await _alertService.UpdateAsync(CurrentUserId, id, req.Enabled);
        if (alert == null) return NotFound();
        return Ok(alert);
    }
}
