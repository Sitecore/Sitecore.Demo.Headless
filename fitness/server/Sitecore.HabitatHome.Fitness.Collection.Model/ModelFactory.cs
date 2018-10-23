using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;
using Sitecore.XConnect.Schema;

namespace Sitecore.HabitatHome.Fitness.Collection.Model
{
    public static class ModelFactory
    {
        public static XdbModel Instance { get; } = CreateModel();

        public static XdbModel CreateModel()
        {
            var builder = new XdbModelBuilder("Sitecore.HabitatHome.Fitness.Collection.Model", new XdbModelVersion(9, 0));

            //Reference Sitecore's model
            builder.ReferenceModel(CollectionModel.Model);

            //Attach the contact facets
            builder.DefineFacet<Contact, NotificationSubscriptionsFacet>(NotificationSubscriptionsFacet.DefaultKey);
            builder.DefineFacet<Contact, NotificationTopicsFacet>(NotificationTopicsFacet.DefaultKey);
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
