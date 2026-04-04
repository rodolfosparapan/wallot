namespace WallotApi.Models.DTOs.Alerts;

public class AlertDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}

public class UpdateAlertRequest
{
    public bool Enabled { get; set; }
}
