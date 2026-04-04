namespace WallotApi.Models.DTOs.Users;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Currency { get; set; } = "BRL";
    public string Language { get; set; } = "pt-BR";
}
