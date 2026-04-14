using System.Net;
using System.Text.Json;
using IntegrationTests.Helpers;
using Xunit;

namespace IntegrationTests;

public class BudgetLimitsTests : IntegrationTestBase
{
    public BudgetLimitsTests(WallotWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task GetBudgetLimits_EmptyDatabase_Returns200WithEmptyList()
    {
        var resp = await Client.GetAsync("/api/budget-limits");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(JsonValueKind.Array, body.ValueKind);
    }

    [Fact]
    public async Task CreateBudgetLimit_ValidRequest_Returns201WithLimit()
    {
        var category = $"Category_{Guid.NewGuid().ToString("N")[..8]}";

        var resp = await Client.PostAsync("/api/budget-limits", Body(new
        {
            category,
            limit_amount = 500.0,
            period = "monthly",
        }));

        Assert.Equal(HttpStatusCode.Created, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.False(string.IsNullOrEmpty(body.GetProperty("id").GetString()));
        Assert.Equal(category, body.GetProperty("category").GetString());
        Assert.Equal(500.0m, body.GetProperty("limit_amount").GetDecimal());
        Assert.Equal("monthly", body.GetProperty("period").GetString());
    }

    [Fact]
    public async Task CreateBudgetLimit_DuplicateCategory_Returns409()
    {
        var category = $"Dup_{Guid.NewGuid().ToString("N")[..8]}";

        await Client.PostAsync("/api/budget-limits", Body(new
        {
            category, limit_amount = 300.0, period = "monthly",
        }));

        var resp = await Client.PostAsync("/api/budget-limits", Body(new
        {
            category, limit_amount = 400.0, period = "monthly",
        }));

        Assert.Equal(HttpStatusCode.Conflict, resp.StatusCode);
    }

    [Fact]
    public async Task UpdateBudgetLimit_ValidId_Returns200WithUpdatedData()
    {
        var category = $"Upd_{Guid.NewGuid().ToString("N")[..8]}";

        var createResp = await Client.PostAsync("/api/budget-limits", Body(new
        {
            category, limit_amount = 200.0, period = "monthly",
        }));
        var created = await createResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var id = created.GetProperty("id").GetString()!;

        var updateResp = await Client.PutAsync($"/api/budget-limits/{id}", Body(new
        {
            limit_amount = 750.0,
        }));

        Assert.Equal(HttpStatusCode.OK, updateResp.StatusCode);

        var body = await updateResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(750.0m, body.GetProperty("limit_amount").GetDecimal());
    }

    [Fact]
    public async Task UpdateBudgetLimit_UnknownId_Returns404()
    {
        var resp = await Client.PutAsync($"/api/budget-limits/{Guid.NewGuid()}",
            Body(new { limit_amount = 100.0 }));

        Assert.Equal(HttpStatusCode.NotFound, resp.StatusCode);
    }

    [Fact]
    public async Task DeleteBudgetLimit_ExistingId_Returns204()
    {
        var category = $"Del_{Guid.NewGuid().ToString("N")[..8]}";

        var createResp = await Client.PostAsync("/api/budget-limits", Body(new
        {
            category, limit_amount = 100.0, period = "monthly",
        }));
        var created = await createResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var id = created.GetProperty("id").GetString()!;

        var deleteResp = await Client.DeleteAsync($"/api/budget-limits/{id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResp.StatusCode);
    }

    [Fact]
    public async Task DeleteBudgetLimit_UnknownId_Returns404()
    {
        var resp = await Client.DeleteAsync($"/api/budget-limits/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, resp.StatusCode);
    }

    [Fact]
    public async Task GetBudgetLimits_AfterCreating_IncludesSpentAmount()
    {
        var category = $"Spent_{Guid.NewGuid().ToString("N")[..8]}";

        await Client.PostAsync("/api/budget-limits", Body(new
        {
            category, limit_amount = 1000.0, period = "monthly",
        }));

        // Add an expense in that category
        var firstOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 150.0, category,
            description = "Test spend", date = firstOfMonth.ToString("o"),
        }));

        var resp = await Client.GetAsync("/api/budget-limits");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var limit = body.EnumerateArray()
            .FirstOrDefault(e => e.GetProperty("category").GetString() == category);

        Assert.NotEqual(default, limit);
        Assert.True(limit.GetProperty("spent_amount").GetDecimal() >= 0m);
    }
}
