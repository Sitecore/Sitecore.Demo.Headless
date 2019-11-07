using System.Collections.Generic;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Client.Configuration;
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
            UpdateXConnectContact(facets);
        }

        public void SetEmailFacet(Facet facet, XConnectClient client, IEntityReference<Contact> contact)
        {
            if (facet is EmailAddressList email)
            {
                client.SetEmails(contact, email);
            }
            else
            {
                Log.Error($"{EmailAddressList.DefaultFacetKey} facet is not of expected type. Expected {typeof(EmailAddressList).FullName}", this);
            }
        }

        public void SetPersonalFacet(Facet facet, XConnectClient client, IEntityReference<Contact> contact)
        {
            if (facet is PersonalInformation personal)
            {
                client.SetPersonal(contact, personal);
            }
            else
            {
                Log.Error($"{PersonalInformation.DefaultFacetKey} facet is not of expected type. Expected {typeof(PersonalInformation).FullName}", this);
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

        private void UpdateXConnectContact(Dictionary<string, Facet> facets)
        {
            var manager = Configuration.Factory.CreateObject("tracking/contactManager", true) as Sitecore.Analytics.Tracking.ContactManager;
            using (var client = SitecoreXConnectClientConfiguration.GetClient())
            {
                try
                {
                    var contactId = client.GetContactIdFromDevice();
                    if (contactId == null)
                    {
                        Log.Fatal("**HF** IdentificationService.UpdateXConnectContact. Cannot resolve contact id from device", this);
                        return;
                    }

                    var contact = client.Get<Contact>(contactId, new ContactExpandOptions(PersonalInformation.DefaultFacetKey, EmailAddressList.DefaultFacetKey));
                    facets.TryGetValue(PersonalInformation.DefaultFacetKey, out Facet newPersonalFacet);
                    contact.Facets.TryGetValue(PersonalInformation.DefaultFacetKey, out Facet currentPersonalFacet);
                    facets.TryGetValue(EmailAddressList.DefaultFacetKey, out Facet newEmailFacet);
                    contact.Facets.TryGetValue(EmailAddressList.DefaultFacetKey, out Facet currentEmailFacet);

                    SetPersonalFacet(currentPersonalFacet == null ? newPersonalFacet : currentPersonalFacet.GetFacetWithDefaultValues(newPersonalFacet), client, contactId);
                    SetEmailFacet(currentEmailFacet == null ? newEmailFacet : currentEmailFacet.GetFacetWithDefaultValues(newEmailFacet), client, contactId);                    

                    client.Submit();
                    manager.RemoveFromSession(Sitecore.Analytics.Tracker.Current.Contact.ContactId);
                    Tracker.Current.Session.Contact = manager.LoadContact(Sitecore.Analytics.Tracker.Current.Contact.ContactId);
                }
                catch (XdbExecutionException ex)
                {
                    Log.Error("UpdateXConnectContact failed.", ex, this);
                }
            }
        }
    }
}