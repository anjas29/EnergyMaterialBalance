using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnergyAndMaterialBalanceModule.Data;
using EnergyAndMaterialBalanceModule.Data.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Globalization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Localization;
using Newtonsoft.Json;

namespace EnergyAndMaterialBalanceModule
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // Start Globalization and localization
            services.AddLocalization(options => options.ResourcesPath = "ResourcesFolder");
            services.AddMvc()
              .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
              .AddDataAnnotationsLocalization();

            // End Globalization and localization

            string connection = Configuration.GetConnectionString("SEICBalanceConnection");
            services.AddDbContext<SEICBalanceContext>(options =>
              options.UseSqlServer(connection));

            services.AddControllersWithViews();
            services.AddScoped<IResourcesRepository, ResourcesRepository>();
            services.AddScoped<IBGroupsRepository, BGroupsRepository>();
            services.AddScoped<IPointsRepository, PointsRepository>();
            services.AddScoped<ISourcesRepository, SourcesRepository>();
            services.AddScoped<IPeriodsRepository, PeriodsRepository>();
            services.AddScoped<ISeicVMappingHistorianRepository, SeicVMappingHistorianRepository>();
            services.AddScoped<ISeicVMappingItehRepository, SeicVMappingItehRepository>();
            services.AddScoped<ISeicVMappingManualRepository, SeicVMappingManualRepository>();

            services.AddSession(options => {
                options.IdleTimeout = TimeSpan.FromMinutes(60);   
            });
            services.AddMvc(option => option.EnableEndpointRouting = false)
                .AddNewtonsoftJson(opt => opt.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            // Start Globalization and localization
            var supportedCultures = new[]
                        {
                new CultureInfo("en-US"),
                new CultureInfo("ru-RU")
            };
            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en-US"), // en for Dev, ru-Ru for production
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures
            });


            // End Globalization and localization



            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseSession();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
