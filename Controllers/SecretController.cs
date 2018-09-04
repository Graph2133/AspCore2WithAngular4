using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using vega.Controllers.Resources;

namespace vega.Controllers
{
    [Route("api/[controller]")]
    public class SecretController
    {

        [HttpGet]
        [Authorize(Roles = "Member,Admin")]
        [Route("member")]
        public IActionResult MemberData()
        {
            return new OkObjectResult("Super secret api message from member: api/secret/member !");
        }

        [HttpGet]
        [Route("admin")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminData()
        {
            List<SecretResource> data = new List<SecretResource>
            {
                new SecretResource("John","Doe"),
                new SecretResource("Anna","Smith"),
                new SecretResource("Peter","Jones")
            };

            return new OkObjectResult(data);

        }

    }
}