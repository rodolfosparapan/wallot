using System.ComponentModel.DataAnnotations;

namespace WallotApi.Models.DTOs.BudgetLimits;

public class CreateBudgetLimitRequest
{
    [Required]
    public string Category { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal LimitAmount { get; set; }

    public string Period { get; set; } = "monthly";
}
