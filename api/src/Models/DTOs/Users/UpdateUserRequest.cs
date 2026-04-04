namespace WallotApi.Models.DTOs.Users;

public class UpdateUserRequest
{
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Currency { get; set; }
    public string? Language { get; set; }
}
