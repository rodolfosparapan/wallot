using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WallotApi.Data;
using WallotApi.Models.DTOs.Users;

namespace WallotApi.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly WallotDbContext _db;

    public UsersController(WallotDbContext db) => _db = db;

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDto>> GetMe()
    {
        var user = await _db.Users.FindAsync(CurrentUserId);
        if (user == null) return NotFound();

        return Ok(new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            Currency = user.Currency,
            Language = user.Language
        });
    }

    [HttpPut("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDto>> UpdateMe([FromBody] UpdateUserRequest req)
    {
        var user = await _db.Users.FindAsync(CurrentUserId);
        if (user == null) return NotFound();

        if (req.FullName != null) user.FullName = req.FullName;
        if (req.AvatarUrl != null) user.AvatarUrl = req.AvatarUrl;
        if (req.Currency != null) user.Currency = req.Currency;
        if (req.Language != null) user.Language = req.Language;

        await _db.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            Currency = user.Currency,
            Language = user.Language
        });
    }
}
