using WallotApi.Models.DTOs.Entries;

namespace WallotApi.Services.Interfaces;

public interface IEntryService
{
    Task<PagedResult<EntryDto>> GetEntriesAsync(string userId, EntryQueryParams query);
    Task<EntryDto?> GetByIdAsync(string userId, string entryId);
    Task<EntryDto> CreateAsync(string userId, CreateEntryRequest req);
    Task<EntryDto?> UpdateAsync(string userId, string entryId, UpdateEntryRequest req);
    Task<bool> DeleteAsync(string userId, string entryId);
    Task<MonthSummaryDto> GetMonthSummaryAsync(string userId, int year, int month);
}
