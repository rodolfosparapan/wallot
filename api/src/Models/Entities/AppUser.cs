using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WallotApi.Models.Entities;

[Table("users")]
public class AppUser
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required, MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    [MaxLength(10)]
    public string Currency { get; set; } = "BRL";

    [MaxLength(10)]
    public string Language { get; set; } = "pt-BR";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Entry> Entries { get; set; } = new List<Entry>();
    public ICollection<BudgetLimit> BudgetLimits { get; set; } = new List<BudgetLimit>();
    public ICollection<Alert> Alerts { get; set; } = new List<Alert>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
