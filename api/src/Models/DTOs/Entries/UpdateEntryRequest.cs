namespace WallotApi.Models.DTOs.Entries;

public class UpdateEntryRequest
{
    public string? Type { get; set; }
    public decimal? Amount { get; set; }
    public string? Category { get; set; }
    public string? Description { get; set; }
    public DateTime? Date { get; set; }
    public string? Source { get; set; }
}
