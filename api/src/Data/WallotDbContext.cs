using Microsoft.EntityFrameworkCore;
using WallotApi.Models.Entities;

namespace WallotApi.Data;

public class WallotDbContext : DbContext
{
    public WallotDbContext(DbContextOptions<WallotDbContext> options) : base(options) { }

    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Entry> Entries => Set<Entry>();
    public DbSet<BudgetLimit> BudgetLimits => Set<BudgetLimit>();
    public DbSet<Alert> Alerts => Set<Alert>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Entry>()
            .HasIndex(e => new { e.UserId, e.Date });
        modelBuilder.Entity<Entry>()
            .HasIndex(e => new { e.UserId, e.Type });
        modelBuilder.Entity<Entry>()
            .HasIndex(e => new { e.UserId, e.Category });

        modelBuilder.Entity<Entry>()
            .HasOne(e => e.User)
            .WithMany(u => u.Entries)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BudgetLimit>()
            .HasOne(b => b.User)
            .WithMany(u => u.BudgetLimits)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BudgetLimit>()
            .HasIndex(b => new { b.UserId, b.Category })
            .IsUnique();

        modelBuilder.Entity<Alert>()
            .HasOne(a => a.User)
            .WithMany(u => u.Alerts)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
