using System;
using Sitecore.Demo.Fitness.Foundation.Analytics.Model;

namespace Sitecore.Demo.Fitness.Feature.Collection.Model
{
    public class SubscribePayload : ISubscribePayload
    {
        public string Token { get; set; }

        public string EventId { get; set; }

        public string EventIdFormatted
        {
            get
            {
                if (Guid.TryParse(EventId, out Guid eventGuid))
                {
                    return eventGuid.ToString("D");
                }

                throw new FormatException("EventId is not formed correctly");
            }
        }

        // TODO: move model validation to action attribute
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(Token) || !string.IsNullOrWhiteSpace(EventId);
        }
    }
}