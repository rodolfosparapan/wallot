using Microsoft.EntityFrameworkCore;
using WallotApi.Data;
using WallotApi.Models.DTOs.Entries;
using WallotApi.Models.Entities;
using WallotApi.Services.Interfaces;

namespace WallotApi.Services;

public class EntryService : IEntryService
{
    private readonly WallotDbContext _db;

    public EntryService(WallotDbContext db) => _db = db;

    public async Task<PagedResult<EntryDto>> GetEntriesAsync(string userId, EntryQueryParams query)
    {
        var q = _db.Entries.Where(e => e.UserId == userId);

        if (!string.IsNullOrEmpty(query.Type))
            q = q.Where(e => e.Type == query.Type);

        if (!string.IsNullOrEmpty(query.Category))
            q = q.Where(e => e.Category == query.Category);

        if (!string.IsNullOrEmpty(query.Month) && TryParseMonth(query.Month, out int year, out int month))
        {
            var start = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            var end = start.AddMonths(1);
            q = q.Where(e => e.Date >= start && e.Date < end);
        }

        if (!string.IsNullOrEmpty(query.Search))
        {
            var search = query.Search.ToLower();
            q = q.Where(e => e.Description.ToLower().Contains(search) || e.Category.ToLower().Contains(search));
        }

        var total = await q.CountAsync();
        var data = await q
            .OrderByDescending(e => e.Date)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(e => ToDto(e))
            .ToListAsync();

        return new PagedResult<EntryDto>
        {
            Data = data,
            Total = total,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<EntryDto?> GetByIdAsync(string userId, string entryId)
    {
        var entry = await _db.Entries.FirstOrDefaultAsync(e => e.Id == entryId && e.UserId == userId);
        return entry == null ? null : ToDto(entry);
    }

    public async Task<EntryDto> CreateAsync(string userId, CreateEntryRequest req)
    {
        var entry = new Entry
        {
            UserId = userId,
            Type = req.Type,
            Amount = req.Amount,
            Category = req.Category,
            Description = req.Description,
            Date = req.Date,
            Source = req.Source
        };

        _db.Entries.Add(entry);
        await _db.SaveChangesAsync();
        return ToDto(entry);
    }

    public async Task<EntryDto?> UpdateAsync(string userId, string entryId, UpdateEntryRequest req)
    {
        var entry = await _db.Entries.FirstOrDefaultAsync(e => e.Id == entryId && e.UserId == userId);
        if (entry == null) return null;

        if (req.Type != null) entry.Type = req.Type;
        if (req.Amount.HasValue) entry.Amount = req.Amount.Value;
        if (req.Category != null) entry.Category = req.Category;
        if (req.Description != null) entry.Description = req.Description;
        if (req.Date.HasValue) entry.Date = req.Date.Value;
        if (req.Source != null) entry.Source = req.Source;

        await _db.SaveChangesAsync();
        return ToDto(entry);
    }

    public async Task<bool> DeleteAsync(string userId, string entryId)
    {
        var entry = await _db.Entries.FirstOrDefaultAsync(e => e.Id == entryId && e.UserId == userId);
        if (entry == null) return false;

        _db.Entries.Remove(entry);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<MonthSummaryDto> GetMonthSummaryAsync(string userId, int year, int month)
    {
        var start = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = start.AddMonths(1);

        var entries = await _db.Entries
            .Where(e => e.UserId == userId && e.Date >= start && e.Date < end)
            .ToListAsync();

        var totalIncome = entries.Where(e => e.Type == "income").Sum(e => e.Amount);
        var totalExpenses = entries.Where(e => e.Type == "expense").Sum(e => e.Amount);

        var topCategories = entries
            .Where(e => e.Type == "expense")
            .GroupBy(e => e.Category)
            .Select(g => new CategorySummaryItem
            {
                Category = g.Key,
                Amount = g.Sum(e => e.Amount),
                Percentage = totalExpenses > 0 ? Math.Round(g.Sum(e => e.Amount) / totalExpenses * 100, 1) : 0
            })
            .OrderByDescending(c => c.Amount)
            .Take(4)
            .ToList();

        return new MonthSummaryDto
        {
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            Balance = totalIncome - totalExpenses,
            TopCategories = topCategories
        };
    }

    private static bool TryParseMonth(string month, out int year, out int monthNum)
    {
        year = 0; monthNum = 0;
        var parts = month.Split('-');
        if (parts.Length != 2) return false;
        return int.TryParse(parts[0], out year) && int.TryParse(parts[1], out monthNum);
    }

    private static EntryDto ToDto(Entry e) => new()
    {
        Id = e.Id,
        UserId = e.UserId,
        Type = e.Type,
        Amount = e.Amount,
        Category = e.Category,
        Description = e.Description,
        Date = e.Date,
        CreatedAt = e.CreatedAt,
        Source = e.Source
    };
}
