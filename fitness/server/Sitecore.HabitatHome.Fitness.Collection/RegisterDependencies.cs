using Microsoft.Extensions.DependencyInjection;
using Sitecore.DependencyInjection;
using Sitecore.HabitatHome.Fitness.Collection.Controllers;
using Sitecore.HabitatHome.Fitness.Collection.Controllers.Events;
using Sitecore.HabitatHome.Fitness.Collection.Controllers.Subscriptions;
using Sitecore.HabitatHome.Fitness.Collection.Services;

namespace Sitecore.HabitatHome.Fitness.Collection
{
    public class RegisterDependencies : IServicesConfigurator
    {
        public void Configure(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IRouter, Router>();

            serviceCollection.AddTransient<IProfileUpdateService, ProfileUpdateService>();
            serviceCollection.AddTransient<IFacetUpdateService, FacetUpdateService>();
            serviceCollection.AddTransient<IStringValueListFacetService, StringValueListFacetService>();
            serviceCollection.AddTransient<IEventNotificationService, EventNotificationService>();
            serviceCollection.AddTransient<ISessionEventSubscriptionsService, SessionEventSubscriptionsService>();

            serviceCollection.AddTransient<HabitatFitnessEventsController>();
            serviceCollection.AddTransient<HabitatFitnessEventFavoritesController>();
            serviceCollection.AddTransient<HabitatFitnessEventRegistrationController>();
            serviceCollection.AddTransient<HabitatFitnessSubscriptionsController>();
        }
    }
}