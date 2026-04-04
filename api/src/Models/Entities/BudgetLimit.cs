using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WallotApi.Models.Entities;

[Table("budget_limits")]
public class BudgetLimit
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal LimitAmount { get; set; }

    [MaxLength(10)]
    public string Period { get; set; } = "monthly";

    [ForeignKey(nameof(UserId))]
    public AppUser User { get; set; } = null!;
}
