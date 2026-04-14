using System.Net;
using System.Text.Json;
using IntegrationTests.Helpers;
using Xunit;

namespace IntegrationTests;

public class InsightsTests : IntegrationTestBase
{
    public InsightsTests(WallotWebApplicationFactory factory) : base(factory) { }

    private readonly string _month = DateTime.UtcNow.ToString("yyyy-MM");

    [Fact]
    public async Task HealthScore_Returns200WithScore()
    {
        var resp = await Client.GetAsync("/api/insights/health-score");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        var score = body.GetProperty("score").GetInt32();
        Assert.InRange(score, 0, 100);
        Assert.False(string.IsNullOrEmpty(body.GetProperty("label").GetString()));
    }

    [Fact]
    public async Task SpendingTrend_DefaultMonths_Returns200WithPoints()
    {
        var resp = await Client.GetAsync("/api/insights/spending-trend");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(JsonValueKind.Array, body.ValueKind);
        Assert.True(body.GetArrayLength() > 0);

        foreach (var point in body.EnumerateArray())
        {
            Assert.False(string.IsNullOrEmpty(point.GetProperty("month").GetString()));
            _ = point.GetProperty("income").GetDecimal();
            _ = point.GetProperty("expenses").GetDecimal();
        }
    }

    [Fact]
    public async Task SpendingTrend_CustomMonths_ReturnsRequestedCount()
    {
        var resp = await Client.GetAsync("/api/insights/spending-trend?months=3");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(3, body.GetArrayLength());
    }

    [Fact]
    public async Task CategoryBreakdown_ValidMonth_Returns200()
    {
        // Add some expenses so we have data
        var firstOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 100.0, category = "Food",
            description = "Lunch", date = firstOfMonth.ToString("o"),
        }));

        var resp = await Client.GetAsync($"/api/insights/category-breakdown?month={_month}");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(JsonValueKind.Array, body.ValueKind);

        foreach (var item in body.EnumerateArray())
        {
            Assert.False(string.IsNullOrEmpty(item.GetProperty("category").GetString()));
            Assert.True(item.GetProperty("amount").GetDecimal() >= 0m);
            Assert.True(item.GetProperty("percentage").GetDecimal() >= 0m);
        }
    }

    [Fact]
    public async Task CategoryBreakdown_InvalidMonthFormat_Returns400()
    {
        var resp = await Client.GetAsync("/api/insights/category-breakdown?month=badformat");
        Assert.Equal(HttpStatusCode.BadRequest, resp.StatusCode);
    }

    [Fact]
    public async Task Chips_ValidMonth_Returns200WithChips()
    {
        var resp = await Client.GetAsync($"/api/insights/chips?month={_month}");

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.Equal(JsonValueKind.Array, body.ValueKind);

        foreach (var chip in body.EnumerateArray())
        {
            Assert.False(string.IsNullOrEmpty(chip.GetProperty("id").GetString()));
            Assert.False(string.IsNullOrEmpty(chip.GetProperty("title").GetString()));
        }
    }

    [Fact]
    public async Task Chips_InvalidMonthFormat_Returns400()
    {
        var resp = await Client.GetAsync("/api/insights/chips?month=not-valid");
        Assert.Equal(HttpStatusCode.BadRequest, resp.StatusCode);
    }

    [Fact]
    public async Task HealthScore_WithMixedEntries_ScoreInValidRange()
    {
        var firstOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        // Add income and expenses to make the score more meaningful
        await Client.PostAsync("/api/entries", Body(new
        {
            type = "income", amount = 5000.0, category = "Salary",
            description = "Paycheck", date = firstOfMonth.ToString("o"),
        }));
        await Client.PostAsync("/api/entries", Body(new
        {
            type = "expense", amount = 2000.0, category = "Rent",
            description = "Rent", date = firstOfMonth.ToString("o"),
        }));

        var resp = await Client.GetAsync("/api/insights/health-score");
        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        var body = await resp.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        Assert.InRange(body.GetProperty("score").GetInt32(), 0, 100);
    }
}
