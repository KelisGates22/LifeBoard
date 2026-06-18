using Microsoft.EntityFrameworkCore;
using LifeBoard.API.Models;

namespace LifeBoard.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
    }
}