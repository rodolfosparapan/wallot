using System.ComponentModel.DataAnnotations;

namespace WallotApi.Models.DTOs.Entries;

public class CreateEntryRequest
{
    [Required]
    public string Type { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public string Category { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public string Source { get; set; } = "manual";
}
