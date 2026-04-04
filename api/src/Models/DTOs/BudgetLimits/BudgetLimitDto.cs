namespace WallotApi.Models.DTOs.BudgetLimits;

public class BudgetLimitDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal LimitAmount { get; set; }
    public decimal SpentAmount { get; set; }
    public string Period { get; set; } = "monthly";
}
