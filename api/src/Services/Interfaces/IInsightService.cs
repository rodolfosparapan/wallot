using WallotApi.Models.DTOs.Insights;

namespace WallotApi.Services.Interfaces;

public interface IInsightService
{
    Task<HealthScoreDto> GetHealthScoreAsync(string userId);
    Task<List<SpendingTrendPointDto>> GetSpendingTrendAsync(string userId, int months);
    Task<List<CategoryBreakdownDto>> GetCategoryBreakdownAsync(string userId, int year, int month);
    Task<List<InsightChipDto>> GetChipsAsync(string userId, int year, int month);
}
