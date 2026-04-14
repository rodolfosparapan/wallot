using WallotApi.Models.DTOs.BudgetLimits;

namespace WallotApi.Services.Interfaces;

public interface IBudgetLimitService
{
    Task<List<BudgetLimitDto>> GetAllAsync(string userId);
    Task<BudgetLimitDto?> CreateAsync(string userId, CreateBudgetLimitRequest req);
    Task<BudgetLimitDto?> UpdateAsync(string userId, string limitId, UpdateBudgetLimitRequest req);
    Task<bool> DeleteAsync(string userId, string limitId);
}
