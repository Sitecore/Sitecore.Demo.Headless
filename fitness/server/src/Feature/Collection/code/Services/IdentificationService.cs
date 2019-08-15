using System.Collections.Generic;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Feature.Collection.Model;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Model;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Feature.Collection.Services
{
    public class IdentificationService : IIdentificationService
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
        }

        public void SetEmailFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            if (facets.TryGetValue(EmailAddressList.DefaultFacetKey, out Facet emailFacet))
            {
                if (emailFacet is EmailAddressList email)
                {
                    client.SetEmails(contact, email);
                }
                else
                {
                    Log.Error($"{EmailAddressList.DefaultFacetKey} facet is not of expected type. Expected {typeof(EmailAddressList).FullName}", this);
                }
            }
        }

        public void SetPersonalFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            if (facets.TryGetValue(PersonalInformation.DefaultFacetKey, out Facet personalFacet))
            {
                if (personalFacet is PersonalInformation personal)
                {
                    client.SetPersonal(contact, personal);
                }
                else
                {
                    Log.Error($"{PersonalInformation.DefaultFacetKey} facet is not of expected type. Expected {typeof(PersonalInformation).FullName}", this);
                }
            }
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
    }
}