using Sitecore.XConnect;

namespace Sitecore.Demo.Fitness.Feature.Collection.Services
{
    public static class FacetExtensions
    { 
        public static T GetFacetWithDefaultValues<T>(this T facet, T newFacet) where T : Facet
        {
            var concurrencyToken = facet.ConcurrencyToken;
            var result = newFacet;
            var type = result.GetType();
            var property = type.GetProperty("ConcurrencyToken");
            property.SetValue(result, concurrencyToken);
            return result;
        }
    }
}