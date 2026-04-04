using WallotApi.Models.DTOs.Auth;
using WallotApi.Models.Entities;

namespace WallotApi.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(string email, string password);
    Task<AuthResponse> RegisterAsync(string email, string password, string fullName);
    Task ForgotPasswordAsync(string email);
    string GenerateJwtToken(AppUser user);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}
