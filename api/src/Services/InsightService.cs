using Microsoft.EntityFrameworkCore;
using WallotApi.Data;
using WallotApi.Models.DTOs.Insights;
using WallotApi.Services.Interfaces;

namespace WallotApi.Services;

public class InsightService : IInsightService
{
    private readonly WallotDbContext _db;

    public InsightService(WallotDbContext db) => _db = db;

    public async Task<HealthScoreDto> GetHealthScoreAsync(string userId)
    {
        var now = DateTime.UtcNow;
        var thisMonthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var thisMonthEnd = thisMonthStart.AddMonths(1);
        var lastMonthStart = thisMonthStart.AddMonths(-1);

        var thisMonthEntries = await _db.Entries
            .Where(e => e.UserId == userId && e.Date >= thisMonthStart && e.Date < thisMonthEnd)
            .ToListAsync();

        var lastMonthEntries = await _db.Entries
            .Where(e => e.UserId == userId && e.Date >= lastMonthStart && e.Date < thisMonthStart)
            .ToListAsync();

        var limits = await _db.BudgetLimits
            .Where(b => b.UserId == userId && b.Period == "monthly")
            .ToListAsync();

        var income = thisMonthEntries.Where(e => e.Type == "income").Sum(e => e.Amount);
        var expenses = thisMonthEntries.Where(e => e.Type == "expense").Sum(e => e.Amount);

        int score = 100;

        foreach (var limit in limits)
        {
            var spent = thisMonthEntries
                .Where(e => e.Type == "expense" && e.Category == limit.Category)
                .Sum(e => e.Amount);
            var ratio = limit.LimitAmount > 0 ? (double)spent / (double)limit.LimitAmount : 0;

            if (ratio > 1.0) score -= 10;
            else if (ratio >= 0.8) score -= 5;
        }

        if (income > 0 && expenses / income > 0.8m) score -= 10;

        score = Math.Clamp(score, 0, 100);

        var lastIncome = lastMonthEntries.Where(e => e.Type == "income").Sum(e => e.Amount);
        var lastExpenses = lastMonthEntries.Where(e => e.Type == "expense").Sum(e => e.Amount);
        var lastScore = ComputeScoreFromData(lastMonthEntries, limits, lastIncome, lastExpenses);

        var change = score - lastScore;
        var trend = change > 0 ? "up" : change < 0 ? "down" : "stable";
        var comparedTo = thisMonthStart.AddMonths(-1).ToString("MMM");

        return new HealthScoreDto
        {
            Score = score,
            MaxScore = 100,
            Label = ScoreLabel(score),
            Trend = trend,
            Change = Math.Abs(change),
            ComparedTo = comparedTo
        };
    }

    public async Task<List<SpendingTrendPointDto>> GetSpendingTrendAsync(string userId, int months)
    {
        var now = DateTime.UtcNow;
        var result = new List<SpendingTrendPointDto>();

        for (int i = months - 1; i >= 0; i--)
        {
            var start = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-i);
            var end = start.AddMonths(1);

            var entries = await _db.Entries
                .Where(e => e.UserId == userId && e.Date >= start && e.Date < end)
                .ToListAsync();

            result.Add(new SpendingTrendPointDto
            {
                Month = start.ToString("MMM"),
                Income = entries.Where(e => e.Type == "income").Sum(e => e.Amount),
                Expenses = entries.Where(e => e.Type == "expense").Sum(e => e.Amount)
            });
        }

        return result;
    }

    public async Task<List<CategoryBreakdownDto>> GetCategoryBreakdownAsync(string userId, int year, int month)
    {
        var start = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = start.AddMonths(1);

        var expenses = await _db.Entries
            .Where(e => e.UserId == userId && e.Type == "expense" && e.Date >= start && e.Date < end)
            .ToListAsync();

        var total = expenses.Sum(e => e.Amount);

        return expenses
            .GroupBy(e => e.Category)
            .Select(g => new CategoryBreakdownDto
            {
                Category = g.Key,
                Amount = g.Sum(e => e.Amount),
                Percentage = total > 0 ? Math.Round(g.Sum(e => e.Amount) / total * 100, 1) : 0
            })
            .OrderByDescending(c => c.Amount)
            .ToList();
    }

    public async Task<List<InsightChipDto>> GetChipsAsync(string userId, int year, int month)
    {
        var start = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = start.AddMonths(1);
        var prevStart = start.AddMonths(-1);

        var thisMonth = await _db.Entries
            .Where(e => e.UserId == userId && e.Type == "expense" && e.Date >= start && e.Date < end)
            .ToListAsync();

        var lastMonth = await _db.Entries
            .Where(e => e.UserId == userId && e.Type == "expense" && e.Date >= prevStart && e.Date < start)
            .ToListAsync();

        var limits = await _db.BudgetLimits
            .Where(b => b.UserId == userId && b.Period == "monthly")
            .ToListAsync();

        var income = (decimal)(await _db.Entries
            .Where(e => e.UserId == userId && e.Type == "income" && e.Date >= start && e.Date < end)
            .SumAsync(e => (double?)e.Amount) ?? 0.0);

        var chips = new List<InsightChipDto>();

        var thisByCategory = thisMonth.GroupBy(e => e.Category)
            .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));
        var lastByCategory = lastMonth.GroupBy(e => e.Category)
            .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

        string? biggestSavingCategory = null;
        decimal biggestSavingPct = 0;
        string? biggestOverspendCategory = null;
        decimal biggestOverspendPct = 0;

        foreach (var cat in lastByCategory.Keys)
        {
            var lastAmt = lastByCategory[cat];
            if (lastAmt == 0) continue;
            var thisAmt = thisByCategory.GetValueOrDefault(cat, 0);
            var pct = (thisAmt - lastAmt) / lastAmt * 100;

            if (pct < biggestSavingPct) { biggestSavingPct = pct; biggestSavingCategory = cat; }
            if (pct > biggestOverspendPct) { biggestOverspendPct = pct; biggestOverspendCategory = cat; }
        }

        if (biggestSavingCategory != null)
            chips.Add(new InsightChipDto
            {
                Id = "saving_" + biggestSavingCategory,
                Icon = "trending-down",
                Title = Capitalize(biggestSavingCategory),
                Subtitle = "vs last month",
                Value = $"{Math.Abs(biggestSavingPct):F0}%",
                Color = "green"
            });

        if (biggestOverspendCategory != null)
            chips.Add(new InsightChipDto
            {
                Id = "overspend_" + biggestOverspendCategory,
                Icon = "trending-up",
                Title = Capitalize(biggestOverspendCategory),
                Subtitle = "vs last month",
                Value = $"+{biggestOverspendPct:F0}%",
                Color = "red"
            });

        var overLimitCategories = limits
            .Where(l => thisByCategory.GetValueOrDefault(l.Category, 0) > l.LimitAmount)
            .Select(l => l.Category)
            .ToList();

        if (overLimitCategories.Count > 0)
            chips.Add(new InsightChipDto
            {
                Id = "over_limit",
                Icon = "alert-circle",
                Title = $"{overLimitCategories.Count} budget(s) exceeded",
                Subtitle = string.Join(", ", overLimitCategories.Select(Capitalize)),
                Value = "Over",
                Color = "red"
            });

        var totalExpenses = thisMonth.Sum(e => e.Amount);
        if (income > 0)
        {
            var savingsRate = (income - totalExpenses) / income * 100;
            chips.Add(new InsightChipDto
            {
                Id = "savings_rate",
                Icon = "wallet",
                Title = "Savings Rate",
                Subtitle = "this month",
                Value = $"{savingsRate:F0}%",
                Color = savingsRate >= 20 ? "green" : savingsRate >= 0 ? "yellow" : "red"
            });
        }

        return chips;
    }

    private static int ComputeScoreFromData(
        List<Models.Entities.Entry> entries,
        List<Models.Entities.BudgetLimit> limits,
        decimal income, decimal expenses)
    {
        int score = 100;
        foreach (var limit in limits)
        {
            var spent = entries
                .Where(e => e.Type == "expense" && e.Category == limit.Category)
                .Sum(e => e.Amount);
            var ratio = limit.LimitAmount > 0 ? (double)spent / (double)limit.LimitAmount : 0;
            if (ratio > 1.0) score -= 10;
            else if (ratio >= 0.8) score -= 5;
        }
        if (income > 0 && expenses / income > 0.8m) score -= 10;
        return Math.Clamp(score, 0, 100);
    }

    private static string ScoreLabel(int score) => score switch
    {
        <= 40 => "Poor",
        <= 60 => "Fair",
        <= 80 => "Good",
        _ => "Great"
    };

    private static string Capitalize(string s) =>
        string.IsNullOrEmpty(s) ? s : char.ToUpper(s[0]) + s[1..];
}
