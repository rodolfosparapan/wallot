namespace WallotApi.Models.DTOs.Insights;

public class HealthScoreDto
{
    public int Score { get; set; }
    public int MaxScore { get; set; } = 100;
    public string Label { get; set; } = string.Empty;
    public string Trend { get; set; } = "stable";
    public int Change { get; set; }
    public string ComparedTo { get; set; } = string.Empty;
}

public class SpendingTrendPointDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Income { get; set; }
    public decimal Expenses { get; set; }
}

public class CategoryBreakdownDto
{
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
}

public class InsightChipDto
{
    public string Id { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}
