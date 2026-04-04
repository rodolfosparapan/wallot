using WallotApi.Models.DTOs.Notifications;

namespace WallotApi.Services.Interfaces;

public interface INotificationService
{
    Task<List<NotificationDto>> GetAllAsync(string userId);
    Task<bool> MarkReadAsync(string userId, string notificationId);
    Task MarkAllReadAsync(string userId);
}
