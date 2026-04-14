using System.Net;
using System.Text.Json;
using IntegrationTests.Helpers;
using Xunit;

namespace IntegrationTests;

public class AuthTests : IClassFixture<WallotWebApplicationFactory>
{
    private readonly HttpClient _client;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true,
    };

    public AuthTests(WallotWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ValidRequest_Returns201WithToken()
    {
        var email = $"reg_{Guid.NewGuid():N}@test.com";
        var resp = await _client.PostAsync("/api/auth/register",
            Body(new { email, password = "Test123!", full_name = "New User" }));

        Assert.Equal(HttpStatusCode.Created, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.False(string.IsNullOrEmpty(body.GetProperty("token").GetString()));
        Assert.False(string.IsNullOrEmpty(body.GetProperty("user_id").GetString()));
        Assert.Equal(email, body.GetProperty("email").GetString());
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns409()
    {
        var email = $"dup_{Guid.NewGuid():N}@test.com";
        await _client.PostAsync("/api/auth/register",
            Body(new { email, password = "Test123!", full_name = "First" }));

        var resp = await _client.PostAsync("/api/auth/register",
            Body(new { email, password = "Test123!", full_name = "Second" }));

        Assert.Equal(HttpStatusCode.Conflict, resp.StatusCode);
    }

    [Fact]
    public async Task Login_ValidCredentials_Returns200WithToken()
    {
        var email = $"login_{Guid.NewGuid():N}@test.com";
        await _client.PostAsync("/api/auth/register",
            Body(new { email, password = "Test123!", full_name = "Login User" }));

        var resp = await _client.PostAsync("/api/auth/login",
            Body(new { email, password = "Test123!" }));

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.False(string.IsNullOrEmpty(body.GetProperty("token").GetString()));
    }

    [Fact]
    public async Task Login_WrongPassword_Returns401()
    {
        var email = $"wrong_{Guid.NewGuid():N}@test.com";
        await _client.PostAsync("/api/auth/register",
            Body(new { email, password = "Test123!", full_name = "User" }));

        var resp = await _client.PostAsync("/api/auth/login",
            Body(new { email, password = "WrongPassword!" }));

        Assert.Equal(HttpStatusCode.Unauthorized, resp.StatusCode);
    }

    [Fact]
    public async Task Login_UnknownEmail_Returns401()
    {
        var resp = await _client.PostAsync("/api/auth/login",
            Body(new { email = "nobody@nowhere.com", password = "Test123!" }));

        Assert.Equal(HttpStatusCode.Unauthorized, resp.StatusCode);
    }

    [Fact]
    public async Task ForgotPassword_ExistingEmail_Returns200()
    {
        var email = $"forgot_{Guid.NewGuid():N}@test.com";
        await _client.PostAsync("/api/auth/register",
            Body(new { email, password = "Test123!", full_name = "User" }));

        var resp = await _client.PostAsync("/api/auth/forgot-password",
            Body(new { email }));

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);
    }

    [Fact]
    public async Task ForgotPassword_UnknownEmail_Returns200()
    {
        // Should not reveal whether email exists
        var resp = await _client.PostAsync("/api/auth/forgot-password",
            Body(new { email = "ghost@nowhere.com" }));

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);
    }

    [Fact]
    public async Task ProtectedEndpoint_WithoutToken_Returns401()
    {
        var resp = await _client.GetAsync("/api/users/me");
        Assert.Equal(HttpStatusCode.Unauthorized, resp.StatusCode);
    }

    [Fact]
    public async Task ProtectedEndpoint_InvalidToken_Returns401()
    {
        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "not.a.real.token");

        var resp = await _client.GetAsync("/api/users/me");
        Assert.Equal(HttpStatusCode.Unauthorized, resp.StatusCode);
    }

    private static System.Net.Http.StringContent Body<T>(T value) =>
        new(System.Text.Json.JsonSerializer.Serialize(value, JsonOptions),
            System.Text.Encoding.UTF8, "application/json");
}
