using System.Collections.Generic;
using Sitecore.Analytics.Tracking.Identification;
using Sitecore.Annotations;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Foundation.Analytics.Model;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Collection.Model;

namespace Sitecore.Demo.Fitness.Feature.Collection.Services
{
    public class IdentificationService : AnalyticsServiceBase, IIdentificationService
    {
        private readonly IContactIdentificationManager contactIdentificationManager;

        public IdentificationService(IContactIdentificationManager contactIdentificationManager)
        {
            this.contactIdentificationManager = contactIdentificationManager;
        }

        public void UpdateFacet([NotNull]IIdentificationPayload data)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            UpdateName(data, facets);
            UpdateEmail(data, facets);

            IdentificationResult result = contactIdentificationManager.IdentifyAs(new KnownContactIdentifier(Context.Site.Domain.Name, data.Email));

            trackerContact.UpdateXConnectFacets(facets);
            UpdateXConnectContact(facets);
        }

        protected void UpdateName(IIdentificationPayload data, Dictionary<string, Facet> facets)
        {
            PersonalInformation personalInfo;
            if (facets.ContainsKey(PersonalInformation.DefaultFacetKey))
            {
                personalInfo = (PersonalInformation)facets[PersonalInformation.DefaultFacetKey];
                personalInfo.FirstName = data.FirstName;
                personalInfo.LastName = data.LastName;
            }
            else
            {
                personalInfo = new PersonalInformation()
                {
                    FirstName = data.FirstName,
                    LastName = data.LastName,
                };

                facets.Add(PersonalInformation.DefaultFacetKey, personalInfo);
            }
        }

        protected void UpdateEmail(IIdentificationPayload data, Dictionary<string, Facet> facets)
        {
            EmailAddressList emails;
            if (facets.ContainsKey(EmailAddressList.DefaultFacetKey))
            {
                emails = (EmailAddressList)facets[EmailAddressList.DefaultFacetKey];
                emails.PreferredEmail = new EmailAddress(data.Email, true);
            }
            else
            {
                emails = new EmailAddressList(new EmailAddress(data.Email, true), Wellknown.PreferredEmailKey);
                facets.Add(EmailAddressList.DefaultFacetKey, emails);
            }
        }

        protected override void SetContactFacets(Dictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contactId)
        {
            var contact = client.Get<Contact>(contactId,
                new ContactExecutionOptions(new ContactExpandOptions(PersonalInformation.DefaultFacetKey, EmailAddressList.DefaultFacetKey)));

            var personalFacet = GetFacetOrDefault(facets, PersonalInformation.DefaultFacetKey, contact, client);
            if (personalFacet is PersonalInformation personal)
            {
                client.SetPersonal(contact, personal);
            }

            var emailFacet = GetFacetOrDefault(facets, EmailAddressList.DefaultFacetKey, contact, client);
            if (emailFacet is EmailAddressList email)
            {
                client.SetEmails(contact, email);
            }
        }
    }
}