namespace WallotApi.Models.DTOs.Entries;

public class MonthSummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance { get; set; }
    public List<CategorySummaryItem> TopCategories { get; set; } = new();
}

public class CategorySummaryItem
{
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
}
