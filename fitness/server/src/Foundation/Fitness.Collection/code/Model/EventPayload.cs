using System;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Model
{
    public class EventPayload
    {
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
            return !string.IsNullOrWhiteSpace(EventId);
        }
    }
}