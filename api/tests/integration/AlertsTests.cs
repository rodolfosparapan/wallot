using System.Net;
using System.Text.Json;
using IntegrationTests.Helpers;
using Xunit;

namespace IntegrationTests;

public class AlertsTests : IntegrationTestBase
{
    public AlertsTests(WallotWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task GetAlerts_Returns200WithList()
    {
        var resp = await Client.GetAsync("/api/alerts");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(JsonValueKind.Array, body.ValueKind);
        // New users get seeded alerts from AuthService
        Assert.True(body.GetArrayLength() > 0);
    }

    [Fact]
    public async Task GetAlerts_EachAlertHasRequiredFields()
    {
        var resp = await Client.GetAsync("/api/alerts");
        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);

        foreach (var alert in body.EnumerateArray())
        {
            Assert.False(string.IsNullOrEmpty(alert.GetProperty("id").GetString()));
            Assert.False(string.IsNullOrEmpty(alert.GetProperty("type").GetString()));
            Assert.False(string.IsNullOrEmpty(alert.GetProperty("label").GetString()));
            // enabled is a bool — just verify it deserializes
            _ = alert.GetProperty("enabled").GetBoolean();
        }
    }

    [Fact]
    public async Task UpdateAlert_ToggleEnabled_Returns200WithUpdatedValue()
    {
        // Get first alert
        var listResp = await Client.GetAsync("/api/alerts");
        var list = await listResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var firstAlert = list.EnumerateArray().First();
        var id = firstAlert.GetProperty("id").GetString()!;
        var originalEnabled = firstAlert.GetProperty("enabled").GetBoolean();

        // Toggle
        var updateResp = await Client.PutAsync($"/api/alerts/{id}",
            Body(new { enabled = !originalEnabled }));

        Assert.Equal(HttpStatusCode.OK, updateResp.StatusCode);

        var body = await updateResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(!originalEnabled, body.GetProperty("enabled").GetBoolean());
    }

    [Fact]
    public async Task UpdateAlert_UnknownId_Returns404()
    {
        var resp = await Client.PutAsync($"/api/alerts/{Guid.NewGuid()}",
            Body(new { enabled = false }));

        Assert.Equal(HttpStatusCode.NotFound, resp.StatusCode);
    }
}
