using Sitecore.Analytics;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Client.WebApi;
using Sitecore.XConnect.Schema;
using Sitecore.Xdb.Common.Web;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace Sitecore.HabitatHome.Fitness.Collection
{
    public static class XConnectClientFactory
    {
        public static IEntityReference<Contact> GetContactIdFromDevice(this XConnectClient client)
        {
            //var deviceId = Sitecore.Analytics.Tracker.Current.Session.Device.DeviceId.ToString("N");
            //return new IdentifiedContactReference("xDB.Tracker", deviceId);

            var deviceId = Tracker.Current.Session.Device.DeviceId;
            var deviceProfile = client.Get(new DeviceProfileReference(deviceId), new ExpandOptions());
            return deviceProfile?.LastKnownContact;
        }

        public static async Task AddContactIdentifier(string email)
        {
            using(var client = await Create())
            {
                var contact = GetContactIdFromDevice(client);
                if(contact != null)
                {
                    client.AddContactIdentifier(contact, new ContactIdentifier(Wellknown.EMAIL_IDENT_SOURCE, email, ContactIdentifierType.Known));
                }
            }
        }

        public static async Task<XConnectClient> Create()
        {
            const string XCONNECT_ENDPOINT_KEY = "xconnect.collection";

            var connectionStrings = WebConfigurationManager.ConnectionStrings;
            var endpoint = connectionStrings[XCONNECT_ENDPOINT_KEY]?.ConnectionString;

            Uri endpointUri;

            if (!Uri.TryCreate(endpoint, UriKind.Absolute, out endpointUri))
            {
                throw new Exception($"Endpoint to xConnect has not been specified.  The key name must be [{XCONNECT_ENDPOINT_KEY}]");
            }

            CollectionWebApiClient collectionClient;
            SearchWebApiClient searchClient;
            ConfigurationWebApiClient configurationClient;
            XConnectClientConfiguration cfg;

            var certificate = connectionStrings["xconnect.collection.certificate"]?.ConnectionString;

            List<IHttpClientModifier> modifiers = null;
            CertificateWebRequestHandlerModifier[] certificateModifiers = null;

            //if a certificate was specified in config
            if (string.IsNullOrEmpty(certificate) == false)
            {
                var certOptions = CertificateWebRequestHandlerModifierOptions.Parse(certificate);
                certificateModifiers = new[] { new CertificateWebRequestHandlerModifier(certOptions) };
                modifiers = new List<IHttpClientModifier>() { new TimeoutHttpClientModifier(new TimeSpan(0, 0, 20)) };
            }

            collectionClient = new CollectionWebApiClient(new Uri(endpointUri, "odata/"), modifiers, certificateModifiers);
            searchClient = new SearchWebApiClient(new Uri(endpointUri, "odata/"), modifiers, certificateModifiers);
            configurationClient = new ConfigurationWebApiClient(new Uri(endpointUri, "configuration/"), modifiers, certificateModifiers);
            cfg = new XConnectClientConfiguration(new XdbRuntimeModel(ModelFactory.Instance), collectionClient, searchClient, configurationClient, true);

            await cfg.InitializeAsync();
            return new XConnectClient(cfg);
        }

        public static async Task<Contact> ResolveContact(XConnectClient client, Guid contactId, ExpandOptions expandOptions)
        {
            return await client.GetContactAsync(contactId, expandOptions);
        }
    }
}