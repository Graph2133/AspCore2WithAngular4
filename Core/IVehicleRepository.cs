using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using vega.Core.Models;

namespace vega.Core
{
    public interface IVehicleRepository
    {
        Task<Vehicle> GetVehicle(int id, bool includeRelated = true); 
        void Add(Vehicle vehicle);
        void Remove(Vehicle vehicle);
        List<Feature> GetAllFeature();
        void AddVehicleFeature(VehicleFeature feature);
        Task<QueryResult<Vehicle>> GetVehicles(VehicleQuery filter);
    }
}