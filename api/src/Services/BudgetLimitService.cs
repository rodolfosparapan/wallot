using Microsoft.EntityFrameworkCore;
using WallotApi.Data;
using WallotApi.Models.DTOs.BudgetLimits;
using WallotApi.Models.Entities;
using WallotApi.Services.Interfaces;

namespace WallotApi.Services;

public class BudgetLimitService : IBudgetLimitService
{
    private readonly WallotDbContext _db;

    public BudgetLimitService(WallotDbContext db) => _db = db;

    public async Task<List<BudgetLimitDto>> GetAllAsync(string userId)
    {
        var limits = await _db.BudgetLimits
            .Where(b => b.UserId == userId)
            .ToListAsync();

        var result = new List<BudgetLimitDto>();
        foreach (var limit in limits)
        {
            var spent = await ComputeSpentAmountAsync(userId, limit.Category, limit.Period);
            result.Add(ToDto(limit, spent));
        }
        return result;
    }

    public async Task<BudgetLimitDto?> CreateAsync(string userId, CreateBudgetLimitRequest req)
    {
        var existing = await _db.BudgetLimits
            .FirstOrDefaultAsync(b => b.UserId == userId && b.Category == req.Category);
        if (existing != null) return null;

        var limit = new BudgetLimit
        {
            UserId = userId,
            Category = req.Category,
            LimitAmount = req.LimitAmount,
            Period = req.Period
        };

        _db.BudgetLimits.Add(limit);
        await _db.SaveChangesAsync();

        var spent = await ComputeSpentAmountAsync(userId, limit.Category, limit.Period);
        return ToDto(limit, spent);
    }

    public async Task<BudgetLimitDto?> UpdateAsync(string userId, string limitId, UpdateBudgetLimitRequest req)
    {
        var limit = await _db.BudgetLimits.FirstOrDefaultAsync(b => b.Id == limitId && b.UserId == userId);
        if (limit == null) return null;

        if (req.LimitAmount.HasValue) limit.LimitAmount = req.LimitAmount.Value;
        if (req.Period != null) limit.Period = req.Period;

        await _db.SaveChangesAsync();

        var spent = await ComputeSpentAmountAsync(userId, limit.Category, limit.Period);
        return ToDto(limit, spent);
    }

    public async Task<bool> DeleteAsync(string userId, string limitId)
    {
        var limit = await _db.BudgetLimits.FirstOrDefaultAsync(b => b.Id == limitId && b.UserId == userId);
        if (limit == null) return false;

        _db.BudgetLimits.Remove(limit);
        await _db.SaveChangesAsync();
        return true;
    }

    private async Task<decimal> ComputeSpentAmountAsync(string userId, string category, string period)
    {
        DateTime start;
        var now = DateTime.UtcNow;

        if (period == "weekly")
        {
            var dayOfWeek = (int)now.DayOfWeek;
            start = now.Date.AddDays(-dayOfWeek);
        }
        else
        {
            start = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        }

        var end = period == "weekly" ? start.AddDays(7) : start.AddMonths(1);

        return (decimal)(await _db.Entries
            .Where(e => e.UserId == userId
                     && e.Category == category
                     && e.Type == "expense"
                     && e.Date >= start
                     && e.Date < end)
            .SumAsync(e => (double?)e.Amount) ?? 0.0);
    }

    private static BudgetLimitDto ToDto(BudgetLimit b, decimal spent) => new()
    {
        Id = b.Id,
        UserId = b.UserId,
        Category = b.Category,
        LimitAmount = b.LimitAmount,
        SpentAmount = spent,
        Period = b.Period
    };
}
