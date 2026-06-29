namespace LifeBoard.API.Models
{
    public class JobApplication
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string Company { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = "Applied";
        public string? JobUrl { get; set; }
        public string? Notes { get; set; }
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}