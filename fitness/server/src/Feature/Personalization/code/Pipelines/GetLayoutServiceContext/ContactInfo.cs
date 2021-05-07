using Sitecore.JavaScriptServices.Configuration;
using Sitecore.LayoutService.ItemRendering.Pipelines.GetLayoutServiceContext;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Pipelines.GetLayoutServiceContext
{
    public class ContactInfo : Sitecore.JavaScriptServices.ViewEngine.LayoutService.Pipelines.GetLayoutServiceContext.JssGetLayoutServiceContextProcessor
    {
        public ContactInfo(IConfigurationResolver configurationResolver) : base(configurationResolver)
        {
        }

        protected override void DoProcess(GetLayoutServiceContextArgs args, AppConfiguration application)
        {
            // TODO: Refactor

            //var contact = GetContact();
            //if (contact != null)
            //{
            //    args.ContextData.Add("contact",
            //        new
            //        {
            //            identification = contact.IdentificationLevel.ToString(),
            //            isNew = contact.IsNew,
            //            visits = contact.System.VisitCount,
            //            value = contact.System.Value,
            //        });
            //}
        }

        //protected Analytics.Tracking.Contact GetContact()
        //{
        //    return Tracker.Current != null && Tracker.IsActive ? Tracker.Current?.Contact : null;
        //}
    }
}