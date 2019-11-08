using System.Collections.Generic;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Feature.Collection.Services
{
    public class IdentificationService : AnalyticsServiceBase, IIdentificationService
    {
        public void UpdateFacet([NotNull]IIdentificationPayload data)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            UpdateName(data, facets);
            UpdateEmail(data, facets);

            Tracker.Current.Session.IdentifyAs(Wellknown.EMAIL_IDENT_SOURCE, data.Email);

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
                new ContactExpandOptions(PersonalInformation.DefaultFacetKey, EmailAddressList.DefaultFacetKey));

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