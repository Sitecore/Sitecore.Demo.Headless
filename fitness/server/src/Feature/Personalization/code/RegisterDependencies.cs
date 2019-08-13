using Microsoft.Extensions.DependencyInjection;
using Sitecore.DependencyInjection;
using Sitecore.HabitatHome.Fitness.Feature.Personalization.Controllers;
using Sitecore.HabitatHome.Fitness.Feature.Personalization.Serializers;
using Sitecore.HabitatHome.Fitness.Feature.Personalization.Services;
using Sitecore.LayoutService.Serialization.ItemSerializers;

namespace Sitecore.HabitatHome.Fitness.Feature.Personalization
{
    public class RegisterDependencies : IServicesConfigurator
    {
        public void Configure(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IRouter, Router>();
            serviceCollection.AddTransient<IItemSerializer, EventItemSerializer>();
            serviceCollection.AddTransient<IItemScoringService, ItemScoringService>();
            serviceCollection.AddTransient<IEventDataService, EventDataService>();
            serviceCollection.AddTransient<IProductDataService, ProductDataService>();
            serviceCollection.AddTransient<HabitatFitnessEventsController>();
            serviceCollection.AddTransient<HabitatFitnessProductsController>();
        }
    }
}