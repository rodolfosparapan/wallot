using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WallotApi.Data;
using WallotApi.Models.DTOs.Auth;
using WallotApi.Models.Entities;
using WallotApi.Services.Interfaces;

namespace WallotApi.Services;

public class AuthService : IAuthService
{
    private readonly WallotDbContext _db;
    private readonly IConfiguration _config;
    private readonly IAlertService _alertService;

    public AuthService(WallotDbContext db, IConfiguration config, IAlertService alertService)
    {
        _db = db;
        _config = config;
        _alertService = alertService;
    }

    public async Task<AuthResponse> LoginAsync(string email, string password)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email.ToLower());
        if (user == null || !VerifyPassword(password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return new AuthResponse
        {
            Token = GenerateJwtToken(user),
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName
        };
    }

    public async Task<AuthResponse> RegisterAsync(string email, string password, string fullName)
    {
        if (await _db.Users.AnyAsync(u => u.Email == email.ToLower()))
            throw new InvalidOperationException("An account with this email already exists.");

        var user = new AppUser
        {
            Email = email.ToLower(),
            PasswordHash = HashPassword(password),
            FullName = fullName
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        await _alertService.SeedDefaultAlertsAsync(user.Id);

        return new AuthResponse
        {
            Token = GenerateJwtToken(user),
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName
        };
    }

    public Task ForgotPasswordAsync(string email)
    {
        // In a real app: generate reset token, send email
        // For now, we silently succeed to avoid user enumeration
        return Task.CompletedTask;
    }

    public string GenerateJwtToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("full_name", user.FullName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiryHours = int.Parse(_config["Jwt:ExpiryHours"] ?? "168");

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string HashPassword(string password) => BCrypt.Net.BCrypt.HashPassword(password);

    public bool VerifyPassword(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}
