using System.Web.Mvc;
using Sitecore.Analytics;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Filters
{
    public class CancelCurrentPage : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Tracker.Current != null && Tracker.Current.IsActive)
            {
                Tracker.Current.CurrentPage.Cancel();
            }
        }
    }
}