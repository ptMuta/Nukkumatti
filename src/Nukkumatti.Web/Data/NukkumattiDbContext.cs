using Microsoft.EntityFrameworkCore;
using Nukkumatti.Web.Data.Entities;

namespace Nukkumatti.Web.Data
{
    public class NukkumattiDbContext : DbContext
    {
        public DbSet<Situation> Situations { get; set; }

        public NukkumattiDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}