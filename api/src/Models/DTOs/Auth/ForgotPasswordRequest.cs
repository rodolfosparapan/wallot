using System.ComponentModel.DataAnnotations;

namespace WallotApi.Models.DTOs.Auth;

public class ForgotPasswordRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}
