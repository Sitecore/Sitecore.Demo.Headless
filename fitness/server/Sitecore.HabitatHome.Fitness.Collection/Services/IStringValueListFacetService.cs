namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IStringValueListFacetService
    {
        void Add(string value, string facetKey);
        void Remove(string value, string facetKey);
    }
}