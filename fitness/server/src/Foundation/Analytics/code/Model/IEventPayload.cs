﻿namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model
{
    public interface IEventPayload
    {
        string EventId { get; set; }
        string EventIdFormatted { get; }
        bool IsValid();
    }
}