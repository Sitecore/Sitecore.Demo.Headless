using Microsoft.Extensions.DependencyInjection;
using Sitecore.DependencyInjection;
using Sitecore.Demo.Fitness.Feature.Collection.Controllers;
using Sitecore.Demo.Fitness.Feature.Collection.Services;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;

namespace Sitecore.Demo.Fitness.Feature.Collection
{
    public class RegisterDependencies : IServicesConfigurator
    {
        public void Configure(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IRouter, Router>();

            serviceCollection.AddTransient<IDemographicsService, DemographicsService>();
            serviceCollection.AddTransient<ISportsService, SportsService>();
            serviceCollection.AddTransient<IIdentificationService, IdentificationService>();

            serviceCollection.AddTransient<IStringValueListFacetService, StringValueListFacetService>();
            serviceCollection.AddTransient<ISessionEventSubscriptionsService, SessionEventSubscriptionsService>();

            serviceCollection.AddTransient<LighthouseFitnessDemographicsController>();
            serviceCollection.AddTransient<LighthouseFitnessEventFavoritesController>();
            serviceCollection.AddTransient<LighthouseFitnessEventRegistrationController>();
            serviceCollection.AddTransient<LighthouseFitnessIdentificationController>();
            serviceCollection.AddTransient<LighthouseFitnessSessionController>();
            serviceCollection.AddTransient<LighthouseFitnessSportsController>();
            serviceCollection.AddTransient<LighthouseFitnessSubscriptionsController>();
        }
    }
}