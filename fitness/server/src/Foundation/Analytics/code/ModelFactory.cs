using Sitecore.Demo.Fitness.Foundation.Analytics.Facets;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;
using Sitecore.XConnect.Schema;

namespace Sitecore.Demo.Fitness.Foundation.Analytics
{
    public static class ModelFactory
    {
        public static XdbModel Model { get; } = CreateModel();

        public static XdbModel CreateModel()
        {
            var builder = new XdbModelBuilder("Sitecore.Demo.Fitness.Foundation.Analytics", new XdbModelVersion(1, 0));

            //Reference Sitecore's model
            builder.ReferenceModel(CollectionModel.Model);

            //Attach the contact facets
            builder.DefineFacet<Contact, StringValueListFacet>(FacetIDs.FavoriteEvents);
            builder.DefineFacet<Contact, StringValueListFacet>(FacetIDs.RegisteredEvents);
            builder.DefineFacet<Contact, StringValueListFacet>(FacetIDs.Subscriptions);
            builder.DefineFacet<Contact, StringValueListFacet>(FacetIDs.SubscriptionTokens);
            builder.DefineFacet<Contact, SportsFacet>(SportsFacet.DefaultKey);
            builder.DefineFacet<Contact, DemographicsFacet>(DemographicsFacet.DefaultKey);

            return builder.BuildModel();
        }

        public static string CreateDeploymentJson(out string modelName)
        {
            XdbModel model = CreateModel();
            modelName = model.ToString();
            var json = Sitecore.XConnect.Serialization.XdbModelWriter.Serialize(model);
            return json;
        }
    }
}
