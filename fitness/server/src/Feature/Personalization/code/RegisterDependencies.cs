using Microsoft.Extensions.DependencyInjection;
using Sitecore.DependencyInjection;
using Sitecore.Demo.Fitness.Feature.Personalization.Controllers;
using Sitecore.Demo.Fitness.Feature.Personalization.Serializers;
using Sitecore.Demo.Fitness.Feature.Personalization.Services;
using Sitecore.LayoutService.Serialization.ItemSerializers;

namespace Sitecore.Demo.Fitness.Feature.Personalization
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
            serviceCollection.AddTransient<LighthouseFitnessEventsController>();
            serviceCollection.AddTransient<LighthouseFitnessProductsController>();
        }
    }
}