using Sitecore.Analytics;
using System.Web.Mvc;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Filters
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