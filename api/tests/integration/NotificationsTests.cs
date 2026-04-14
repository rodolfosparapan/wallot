using System.Net;
using System.Text.Json;
using IntegrationTests.Helpers;
using Xunit;

namespace IntegrationTests;

public class NotificationsTests : IntegrationTestBase
{
    public NotificationsTests(WallotWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task GetNotifications_Returns200WithList()
    {
        var resp = await Client.GetAsync("/api/notifications");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(JsonValueKind.Array, body.ValueKind);
    }

    [Fact]
    public async Task GetNotifications_EachNotificationHasRequiredFields()
    {
        var resp = await Client.GetAsync("/api/notifications");
        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);

        foreach (var notif in body.EnumerateArray())
        {
            Assert.False(string.IsNullOrEmpty(notif.GetProperty("id").GetString()));
            Assert.False(string.IsNullOrEmpty(notif.GetProperty("title").GetString()));
            _ = notif.GetProperty("is_read").GetBoolean();
        }
    }

    [Fact]
    public async Task ReadAll_Returns204()
    {
        var resp = await Client.PutAsync("/api/notifications/read-all", null);
        Assert.Equal(HttpStatusCode.NoContent, resp.StatusCode);
    }

    [Fact]
    public async Task ReadAll_ThenGetNotifications_AllMarkedRead()
    {
        // Seed some notifications first (new user gets welcome notification from AuthService)
        // Mark all as read
        await Client.PutAsync("/api/notifications/read-all", null);

        var resp = await Client.GetAsync("/api/notifications");
        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);

        foreach (var notif in body.EnumerateArray())
            Assert.True(notif.GetProperty("is_read").GetBoolean());
    }

    [Fact]
    public async Task MarkSingleRead_ExistingId_Returns204()
    {
        var listResp = await Client.GetAsync("/api/notifications");
        var list = await listResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);

        // Skip if no notifications
        if (list.GetArrayLength() == 0)
            return;

        var id = list.EnumerateArray().First().GetProperty("id").GetString()!;
        var resp = await Client.PutAsync($"/api/notifications/{id}/read", null);

        Assert.Equal(HttpStatusCode.NoContent, resp.StatusCode);
    }

    [Fact]
    public async Task MarkSingleRead_UnknownId_Returns404()
    {
        var resp = await Client.PutAsync($"/api/notifications/{Guid.NewGuid()}/read", null);
        Assert.Equal(HttpStatusCode.NotFound, resp.StatusCode);
    }
}
