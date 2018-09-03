using System.Security.Claims;
using System.Threading.Tasks;

namespace vega.Extensions.TokenAuth
{
    public interface IJwtFactory
    {
        Task<string> GenerateEncodedToken(string userName, ClaimsIdentity identity);
        Task<ClaimsIdentity> GenerateClaimsIdentity(string userName, string id);
    }
}