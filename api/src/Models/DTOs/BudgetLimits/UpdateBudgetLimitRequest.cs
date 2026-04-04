namespace WallotApi.Models.DTOs.BudgetLimits;

public class UpdateBudgetLimitRequest
{
    public decimal? LimitAmount { get; set; }
    public string? Period { get; set; }
}
