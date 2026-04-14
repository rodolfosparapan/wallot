using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Xunit;

namespace IntegrationTests.Helpers;

public abstract class IntegrationTestBase : IClassFixture<WallotWebApplicationFactory>, IAsyncLifetime
{
    protected readonly HttpClient Client;
    protected readonly WallotWebApplicationFactory Factory;
    protected string Token = string.Empty;
    protected string UserId = string.Empty;

    protected static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true,
    };

    protected IntegrationTestBase(WallotWebApplicationFactory factory)
    {
        Factory = factory;
        Client = factory.CreateClient();
    }

    /// <summary>
    /// Override in subclasses to provide a unique seed so test classes don't share user accounts.
    /// </summary>
    protected virtual string UserSeed => GetType().Name;

    public async Task InitializeAsync()
    {
        var email = $"{UserSeed.ToLower().Replace(" ", "_")}@test.com";
        (Token, UserId) = await RegisterOrLoginAsync(email, "Test123!", "Test User");
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
    }

    public Task DisposeAsync() => Task.CompletedTask;

    // ── Helpers ────────────────────────────────────────────────────────────────

    protected async Task<(string token, string userId)> RegisterOrLoginAsync(
        string email, string password, string fullName)
    {
        var registerResp = await Client.PostAsync("/api/auth/register",
            Body(new { email, password, full_name = fullName }));

        JsonElement body;
        if (registerResp.StatusCode == System.Net.HttpStatusCode.Conflict)
        {
            var loginResp = await Client.PostAsync("/api/auth/login",
                Body(new { email, password }));
            loginResp.EnsureSuccessStatusCode();
            body = await loginResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        }
        else
        {
            registerResp.EnsureSuccessStatusCode();
            body = await registerResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        }

        return (body.GetProperty("token").GetString()!, body.GetProperty("user_id").GetString()!);
    }

    protected static StringContent Body<T>(T value) =>
        new(JsonSerializer.Serialize(value, JsonOptions), Encoding.UTF8, "application/json");

    protected async Task<T> ReadAsync<T>(HttpResponseMessage response)
    {
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(json, JsonOptions)
               ?? throw new InvalidOperationException($"Null result deserializing: {json}");
    }
}
