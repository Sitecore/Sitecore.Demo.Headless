using Microsoft.Extensions.DependencyInjection;
using Sitecore.DependencyInjection;
using Sitecore.HabitatHome.Fitness.Collection.Controllers;
using Sitecore.HabitatHome.Fitness.Collection.Controllers.Subscriptions;
using Sitecore.HabitatHome.Fitness.Collection.Services;

namespace Sitecore.HabitatHome.Fitness.Collection
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

            serviceCollection.AddTransient<HabitatFitnessDemographicsController>();
            serviceCollection.AddTransient<HabitatFitnessEventFavoritesController>();
            serviceCollection.AddTransient<HabitatFitnessEventRegistrationController>();
            serviceCollection.AddTransient<HabitatFitnessIdentificationController>();
            serviceCollection.AddTransient<HabitatFitnessSessionController>();
            serviceCollection.AddTransient<HabitatFitnessSportsController>();
            serviceCollection.AddTransient<HabitatFitnessSubscriptionsController>();
        }
    }
}