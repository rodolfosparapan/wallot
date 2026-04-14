using System.Net;
using System.Text.Json;
using IntegrationTests.Helpers;
using Xunit;

namespace IntegrationTests;

public class UsersTests : IntegrationTestBase
{
    public UsersTests(WallotWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task GetMe_AuthenticatedUser_Returns200WithUserData()
    {
        var resp = await Client.GetAsync("/api/users/me");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.False(string.IsNullOrEmpty(body.GetProperty("id").GetString()));
        Assert.Contains("@test.com", body.GetProperty("email").GetString() ?? "");
        Assert.False(string.IsNullOrEmpty(body.GetProperty("full_name").GetString()));
        Assert.False(string.IsNullOrEmpty(body.GetProperty("currency").GetString()));
        Assert.False(string.IsNullOrEmpty(body.GetProperty("language").GetString()));
    }

    [Fact]
    public async Task UpdateMe_FullName_Returns200WithUpdatedName()
    {
        var resp = await Client.PutAsync("/api/users/me",
            Body(new { full_name = "Updated Name" }));

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal("Updated Name", body.GetProperty("full_name").GetString());
    }

    [Fact]
    public async Task UpdateMe_Currency_Returns200WithUpdatedCurrency()
    {
        var resp = await Client.PutAsync("/api/users/me",
            Body(new { currency = "USD" }));

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal("USD", body.GetProperty("currency").GetString());
    }

    [Fact]
    public async Task UpdateMe_Language_Returns200WithUpdatedLanguage()
    {
        var resp = await Client.PutAsync("/api/users/me",
            Body(new { language = "en-US" }));

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal("en-US", body.GetProperty("language").GetString());
    }

    [Fact]
    public async Task UpdateMe_MultipleFields_AllFieldsUpdated()
    {
        var resp = await Client.PutAsync("/api/users/me",
            Body(new { full_name = "Multi Update", currency = "EUR", language = "fr-FR" }));

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal("Multi Update", body.GetProperty("full_name").GetString());
        Assert.Equal("EUR", body.GetProperty("currency").GetString());
        Assert.Equal("fr-FR", body.GetProperty("language").GetString());
    }
}
