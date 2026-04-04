namespace WallotApi.Models.DTOs.Entries;

public class EntryQueryParams
{
    public string? Type { get; set; }
    public string? Category { get; set; }
    public string? Month { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
