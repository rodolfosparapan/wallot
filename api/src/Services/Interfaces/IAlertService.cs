using WallotApi.Models.DTOs.Alerts;

namespace WallotApi.Services.Interfaces;

public interface IAlertService
{
    Task<List<AlertDto>> GetAllAsync(string userId);
    Task<AlertDto?> UpdateAsync(string userId, string alertId, bool enabled);
    Task SeedDefaultAlertsAsync(string userId);
}
