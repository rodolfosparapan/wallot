using Microsoft.EntityFrameworkCore;
using WallotApi.Data;
using WallotApi.Models.DTOs.Alerts;
using WallotApi.Models.Entities;
using WallotApi.Services.Interfaces;

namespace WallotApi.Services;

public class AlertService : IAlertService
{
    private readonly WallotDbContext _db;

    public AlertService(WallotDbContext db) => _db = db;

    public async Task<List<AlertDto>> GetAllAsync(string userId)
    {
        return await _db.Alerts
            .Where(a => a.UserId == userId)
            .Select(a => ToDto(a))
            .ToListAsync();
    }

    public async Task<AlertDto?> UpdateAsync(string userId, string alertId, bool enabled)
    {
        var alert = await _db.Alerts.FirstOrDefaultAsync(a => a.Id == alertId && a.UserId == userId);
        if (alert == null) return null;

        alert.Enabled = enabled;
        await _db.SaveChangesAsync();
        return ToDto(alert);
    }

    public async Task SeedDefaultAlertsAsync(string userId)
    {
        var defaults = new[]
        {
            new Alert
            {
                UserId = userId,
                Type = "budget_warnings",
                Label = "Budget Warnings",
                Description = "Get notified when spending approaches your budget limit",
                Enabled = true
            },
            new Alert
            {
                UserId = userId,
                Type = "over_limit",
                Label = "Over Limit",
                Description = "Get notified when you exceed a budget limit",
                Enabled = true
            },
            new Alert
            {
                UserId = userId,
                Type = "weekly_summary",
                Label = "Weekly Summary",
                Description = "Receive a weekly overview of your spending",
                Enabled = true
            }
        };

        _db.Alerts.AddRange(defaults);
        await _db.SaveChangesAsync();
    }

    private static AlertDto ToDto(Alert a) => new()
    {
        Id = a.Id,
        UserId = a.UserId,
        Type = a.Type,
        Label = a.Label,
        Description = a.Description,
        Enabled = a.Enabled
    };
}
