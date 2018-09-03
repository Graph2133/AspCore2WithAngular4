using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using vega.Core.Models;
using vega.Core.Models.ViewModels;
using vega.Extensions.Helpers;
using vega.Persistence;

namespace vega.Controllers
{
   [Route("api/[controller]")] 
    public class AccountsController : Controller
    {
        private readonly VegaDbContext _appDbContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public AccountsController(UserManager<AppUser> userManager, IMapper mapper, VegaDbContext appDbContext)
        {
            _userManager = userManager;
            _mapper = mapper;
            _appDbContext = appDbContext;
        }

        // POST api/accounts
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userIdentity = _mapper.Map<AppUser>(model);

            IdentityResult result = await _userManager.CreateAsync(userIdentity, model.Password);
            IdentityResult roleResult = await _userManager.AddToRoleAsync(userIdentity, "Member");//default role assign

            if(!roleResult.Succeeded)
                return new BadRequestObjectResult(Errors.AddErrorsToModelState(roleResult, ModelState));
            if (!result.Succeeded) 
                return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));

            await _appDbContext.SaveChangesAsync();

            return new OkObjectResult("Account created");
        }
    }
}