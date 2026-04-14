using System.Net;
using System.Text.Json;
using IntegrationTests.Helpers;
using Xunit;

namespace IntegrationTests;

public class EntriesTests : IntegrationTestBase
{
    public EntriesTests(WallotWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task GetEntries_Returns200WithPagedStructure()
    {
        var resp = await Client.GetAsync("/api/entries");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.True(body.TryGetProperty("total", out _));
        Assert.True(body.TryGetProperty("data", out var data));
        Assert.Equal(JsonValueKind.Array, data.ValueKind);
        Assert.True(body.TryGetProperty("page", out _));
        Assert.True(body.TryGetProperty("page_size", out _));
    }

    [Fact]
    public async Task CreateEntry_ValidExpense_Returns201WithEntry()
    {
        var resp = await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense",
            amount = 150.50,
            category = "Food",
            description = "Groceries",
            date = DateTime.UtcNow.ToString("o"),
        }));

        Assert.Equal(HttpStatusCode.Created, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.False(string.IsNullOrEmpty(body.GetProperty("id").GetString()));
        Assert.Equal("expense", body.GetProperty("type").GetString());
        Assert.Equal(150.50m, body.GetProperty("amount").GetDecimal());
        Assert.Equal("Food", body.GetProperty("category").GetString());
        Assert.Equal("Groceries", body.GetProperty("description").GetString());
        Assert.Equal(UserId, body.GetProperty("user_id").GetString());
    }

    [Fact]
    public async Task CreateEntry_ValidIncome_Returns201()
    {
        var resp = await Client.PostAsync("/api/entries", Body(new
        {
            type = "income",
            amount = 3000.00,
            category = "Salary",
            description = "Monthly salary",
            date = DateTime.UtcNow.ToString("o"),
        }));

        Assert.Equal(HttpStatusCode.Created, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal("income", body.GetProperty("type").GetString());
    }

    [Fact]
    public async Task GetEntries_AfterCreating_ReturnsEntries()
    {
        await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 50.0, category = "Transport",
            description = "Bus", date = DateTime.UtcNow.ToString("o"),
        }));

        var resp = await Client.GetAsync("/api/entries");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.True(body.GetProperty("total").GetInt32() >= 1);
    }

    [Fact]
    public async Task GetEntries_FilterByType_ReturnsOnlyMatchingEntries()
    {
        await Client.PostAsync("/api/entries", Body(new
        {
            type = "income", amount = 100.0, category = "Bonus",
            description = "Year-end bonus", date = DateTime.UtcNow.ToString("o"),
        }));

        var resp = await Client.GetAsync("/api/entries?type=income");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        foreach (var entry in body.GetProperty("data").EnumerateArray())
            Assert.Equal("income", entry.GetProperty("type").GetString());
    }

    [Fact]
    public async Task GetEntries_FilterByCategory_ReturnsOnlyMatchingEntries()
    {
        await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 30.0, category = "Coffee",
            description = "Latte", date = DateTime.UtcNow.ToString("o"),
        }));

        var resp = await Client.GetAsync("/api/entries?category=Coffee");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        foreach (var entry in body.GetProperty("data").EnumerateArray())
            Assert.Equal("Coffee", entry.GetProperty("category").GetString());
    }

    [Fact]
    public async Task GetEntries_Pagination_RespectsPageSize()
    {
        // Create 5 entries
        for (var i = 0; i < 5; i++)
        {
            await Client.PostAsync("/api/entries", Body(new
            {
                type = "expense", amount = 10.0 + i, category = "Test",
                description = $"Entry {i}", date = DateTime.UtcNow.ToString("o"),
            }));
        }

        var resp = await Client.GetAsync("/api/entries?pageSize=2&page=1");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(2, body.GetProperty("data").GetArrayLength());
        Assert.Equal(2, body.GetProperty("page_size").GetInt32());
        Assert.Equal(1, body.GetProperty("page").GetInt32());
    }

    [Fact]
    public async Task GetEntry_ExistingId_Returns200()
    {
        var createResp = await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 25.0, category = "Books",
            description = "Novel", date = DateTime.UtcNow.ToString("o"),
        }));
        var created = await createResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var id = created.GetProperty("id").GetString()!;

        var resp = await Client.GetAsync($"/api/entries/{id}");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(id, body.GetProperty("id").GetString());
    }

    [Fact]
    public async Task GetEntry_UnknownId_Returns404()
    {
        var resp = await Client.GetAsync($"/api/entries/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, resp.StatusCode);
    }

    [Fact]
    public async Task UpdateEntry_ValidFields_Returns200WithUpdatedData()
    {
        var createResp = await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 100.0, category = "Misc",
            description = "Original", date = DateTime.UtcNow.ToString("o"),
        }));
        var created = await createResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var id = created.GetProperty("id").GetString()!;

        var updateResp = await Client.PutAsync($"/api/entries/{id}", Body(new
        {
            amount = 200.0,
            description = "Updated description",
        }));

        Assert.Equal(HttpStatusCode.OK, updateResp.StatusCode);

        var body = await updateResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(200.0m, body.GetProperty("amount").GetDecimal());
        Assert.Equal("Updated description", body.GetProperty("description").GetString());
    }

    [Fact]
    public async Task UpdateEntry_UnknownId_Returns404()
    {
        var resp = await Client.PutAsync($"/api/entries/{Guid.NewGuid()}",
            Body(new { amount = 99.0 }));
        Assert.Equal(HttpStatusCode.NotFound, resp.StatusCode);
    }

    [Fact]
    public async Task DeleteEntry_ExistingId_Returns204()
    {
        var createResp = await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 5.0, category = "Delete Me",
            description = "To delete", date = DateTime.UtcNow.ToString("o"),
        }));
        var created = await createResp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var id = created.GetProperty("id").GetString()!;

        var deleteResp = await Client.DeleteAsync($"/api/entries/{id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResp.StatusCode);

        // Verify it's gone
        var getResp = await Client.GetAsync($"/api/entries/{id}");
        Assert.Equal(HttpStatusCode.NotFound, getResp.StatusCode);
    }

    [Fact]
    public async Task DeleteEntry_UnknownId_Returns404()
    {
        var resp = await Client.DeleteAsync($"/api/entries/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, resp.StatusCode);
    }

    [Fact]
    public async Task GetSummary_ValidMonth_Returns200WithTotals()
    {
        var month = DateTime.UtcNow.ToString("yyyy-MM");
        var firstOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        await Client.PostAsync("/api/entries", Body(new
        {
            type = "income", amount = 1000.0, category = "Salary",
            description = "Pay", date = firstOfMonth.ToString("o"),
        }));
        await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 200.0, category = "Food",
            description = "Groceries", date = firstOfMonth.ToString("o"),
        }));

        var resp = await Client.GetAsync($"/api/entries/summary?month={month}");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.True(body.GetProperty("total_income").GetDecimal() >= 1000m);
        Assert.True(body.GetProperty("total_expenses").GetDecimal() >= 200m);
    }

    [Fact]
    public async Task GetSummary_InvalidMonthFormat_Returns400()
    {
        var resp = await Client.GetAsync("/api/entries/summary?month=not-a-month");
        Assert.Equal(HttpStatusCode.BadRequest, resp.StatusCode);
    }
}
