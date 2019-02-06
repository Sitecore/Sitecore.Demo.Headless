using Microsoft.Extensions.Logging;
using Sitecore.Framework.Conditions;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.Marketing.Automation.Activity;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Operations;
using Sitecore.Xdb.MarketingAutomation.Core.Activity;
using Sitecore.Xdb.MarketingAutomation.Core.Processing.Plan;
using System;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Automation.Activities
{
    public class ClearEventSubscriptions : BaseActivity
    {
        public ClearEventSubscriptions(ILogger<ValidateEmailAddress> logger) : base(logger)
        {
        }

        public override ActivityResult Invoke(IContactProcessingContext context)
        {
            Condition.Requires(context, nameof(context)).IsNotNull();
            if (context.Contact == null)
            {
                return new Failure("Contact processing context hasn't been set");
            }

            try
            {
                StringValueListFacet emptyFacet = new StringValueListFacet() { Values = new List<string>() };
                var facetReference = new FacetReference(context.Contact, FacetIDs.Subscriptions);
                var setFacetOperation = Services.Collection.ClearFacet<StringValueListFacet>(facetReference, emptyFacet);
                Services.Collection.Submit();

                if (setFacetOperation.Result.Status != SaveResultStatus.Success)
                {
                    throw new FacetOperationException();
                }

                Logger.LogDebug($"{FacetIDs.Subscriptions} facet cleared from contact {context.Contact.Id}");
                return new SuccessMove();
            }
            catch (Exception ex)
            {
                return new Failure($"ClearEventSubscriptions failed with '{ex.Message}'");
            }
        }
    }
}