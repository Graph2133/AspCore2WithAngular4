using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using vega.Core;
using vega.Persistence;
using vega.Core.Models;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using vega.Extensions;
using vega.Core.Models.AuthModels;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using vega.Extensions.Helpers;
using vega.Extensions.TokenAuth;

namespace vega
{
    public class Startup
    {

        private const string SecretKey = "iNivDmHLpUA223sqsfhqGbMRdRj1PVkH"; // todo: get this from somewhere secure
        private readonly SymmetricSecurityKey _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
              .SetBasePath(env.ContentRootPath)
              .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
              .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
              .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<PhotoSettings>(Configuration.GetSection("PhotoSettings"));
            services.AddDbContext<VegaDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<IVehicleRepository, VehicleRepository>();
            services.AddScoped<IPhotoRepository, PhotoRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IJwtFactory, JwtFactory>();

            //===== identity (registration model configuration)====
            var builder = services.AddIdentityCore<AppUser>(o =>
              {
                  // configure identity options
                  o.Password.RequireDigit = false;
                  o.Password.RequireLowercase = false;
                  o.Password.RequireUppercase = false;
                  o.Password.RequireNonAlphanumeric = false;
                  o.Password.RequiredLength = 6;
              });
            builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), builder.Services);
            builder.AddEntityFrameworkStores<VegaDbContext>().AddDefaultTokenProviders();
            //===JWT validation properties /jwt wire up
            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));
            // Configure JwtIssuerOptions
            services.Configure<JwtIssuerOptions>(options =>
          {
              options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];// or smth like ['Issuer']
              options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
              options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
          });
            //===== token parameters (Json Web TOKEN)
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _signingKey,
                // if u want to configure expiration time configure JwtIssuer first
                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
            //=====
            services.AddAuthentication(options =>
              {
                  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

              }).AddJwtBearer(configureOptions =>
                  {
                      configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                      configureOptions.TokenValidationParameters = tokenValidationParameters; //token params assign
                      configureOptions.SaveToken = true;
                  });
            services.AddAutoMapper();
            services.AddMvc().AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());

            services.AddScoped<SignInManager<AppUser>, SignInManager<AppUser>>();
            services.AddScoped<RoleManager<IdentityRole>, RoleManager<IdentityRole>>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env,IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                // Display some server errors 
                app.UseExceptionHandler(
                builder =>
                {
                    builder.Run(
                            async context =>
                            {
                                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                                context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                                var error = context.Features.Get<IExceptionHandlerFeature>();
                                if (error != null)
                                {
                                    context.Response.AddApplicationError(error.Error.Message);
                                    await context.Response.WriteAsync(error.Error.Message).ConfigureAwait(false);
                                }
                            });
                });
            }
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
             
            ConfigureDefaultRoles(serviceProvider).Wait();
            ConfigureSuperUser(serviceProvider).Wait();
        }

        //Admin setup
        private async Task ConfigureSuperUser(IServiceProvider serviceProvider)
        {
            var UserManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();
            //Here you could create a super user who will maintain the web app
            var poweruser = new AppUser
            {
                UserName = Configuration["SuperUserOptions:Email"],
                Email = Configuration["SuperUserOptions:Email"],
                FirstName=Configuration["SuperUserOptions:Email"],
                LastName =Configuration["SuperUserOptions:LastName"]
            };
            var _user = await UserManager.FindByEmailAsync(Configuration["SuperUserOptions:Email"]);
            if (_user == null)
            {
                var createPowerUser = await UserManager.CreateAsync(poweruser, Configuration["SuperUserOptions:Password"]);
                if (createPowerUser.Succeeded)
                {
                    //here we tie the new user to the role
                    await UserManager.AddToRoleAsync(poweruser, "Admin");
                    await UserManager.AddToRoleAsync(poweruser, "Member");
                }
            }
        }

        //Default roles setup
        private async Task ConfigureDefaultRoles(IServiceProvider serviceProvider)
        {
            var RoleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            string[] roleNames = { "Admin", "Member" };
            IdentityResult roleResult;
            foreach (var roleName in roleNames)
            {
                var roleExist = await RoleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    //create the roles and seed them to the database:
                    roleResult = await RoleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }

    }
}
