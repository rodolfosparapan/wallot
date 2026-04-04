using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WallotApi.Models.Entities;

[Table("alerts")]
public class Alert
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Label { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public bool Enabled { get; set; } = true;

    [ForeignKey(nameof(UserId))]
    public AppUser User { get; set; } = null!;
}
