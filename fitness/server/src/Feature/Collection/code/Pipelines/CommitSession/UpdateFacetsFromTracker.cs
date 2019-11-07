using Sitecore.Analytics.Pipelines.CommitSession;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Feature.Collection.Services;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Client.Configuration;

namespace Sitecore.HabitatHome.Fitness.Feature.Collection.Pipelines.CommitSession
{
    public class UpdateFacetsFromTracker : CommitSessionProcessor
    {
        private readonly IStringValueListFacetService stringValueListFacetService;
        private readonly IDemographicsService demographicsService;
        private readonly ISportsService sportsService;
        private readonly IIdentificationService identificationService;

        public UpdateFacetsFromTracker([NotNull] IIdentificationService identificationService,
                                       [NotNull] IDemographicsService demographicsService,
                                       [NotNull] ISportsService sportsService,
                                       [NotNull] IStringValueListFacetService stringValueListFacetService)
        {
            this.identificationService = identificationService;
            this.demographicsService = demographicsService;
            this.sportsService = sportsService;
            this.stringValueListFacetService = stringValueListFacetService;
        }

        public override void Process(CommitSessionPipelineArgs args)
        {
            var facets = args.Session.Contact.GetXConnectFacets();
            if (facets == null)
            {
                Log.Warn($"**HF** UpdateFacetsFromTracker.Process(). XConnectFacets could not be loaded for contact {args.Session.Contact.ContactId.ToString()}", this);
                return;
            }

            if (identificationService == null || demographicsService == null || sportsService == null || stringValueListFacetService == null)
            {
                Log.Error($"**HF** UpdateFacetsFromTracker.Process(). skips, some services were not resolved.", this);
                return;
            }

            using (var client = SitecoreXConnectClientConfiguration.GetClient())
            {
                try
                {
                    var contact = client.GetContactIdFromDevice();
                    if (contact == null)
                    {
                        Log.Fatal("**HF** UpdateFacetsFromTracker.Process(). Cannot resolve contact id from device", this);
                        return;
                    }

                    demographicsService.SetFacet(facets, client, contact);
                    sportsService.SetFacet(facets, client, contact);

                    stringValueListFacetService.SetFacet(facets, client, contact, FacetIDs.FavoriteEvents);
                    stringValueListFacetService.SetFacet(facets, client, contact, FacetIDs.RegisteredEvents);
                    stringValueListFacetService.SetFacet(facets, client, contact, FacetIDs.Subscriptions);
                    stringValueListFacetService.SetFacet(facets, client, contact, FacetIDs.SubscriptionTokens);

                    client.Submit();
                }
                catch (XdbExecutionException ex)
                {
                    Log.Error("UpdateFacetsFromTracker failed miserably.", ex, this);
                }
            }
        }
    }
}