using Microsoft.EntityFrameworkCore;
using vega.Core.Models;

namespace vega.Persistence
{
    public class VegaDbContext:DbContext
    {
        public DbSet<Make> Makes { get; set; }
        public DbSet<Model> Models { get; set; }
        public DbSet<Feature> Features{get;set;}
        public DbSet<Vehicle> Vehicles{get;set;}
        public DbSet<Photo> Photos { get; set; }
        public DbSet<VehicleFeature> VehicleFeatures { get; set; }


        public VegaDbContext (DbContextOptions<VegaDbContext> options)
         : base(options)
        {
            
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            modelBuilder.Entity<VehicleFeature>().HasKey(x => 
              new { x.VehicleId, x.FeatureId });
        }

    }
}