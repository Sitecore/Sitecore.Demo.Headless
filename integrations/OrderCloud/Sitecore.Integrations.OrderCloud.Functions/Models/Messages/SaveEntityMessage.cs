using System;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.Messages
{
    public class SaveEntityMessage
    {
        public string EventType { get; set; }

        public DateTime TimeStamp { get; set; }

        public bool IsNew { get; set; }

        public string TargetDefinition { get; set; }

        public long TargetId { get; set; }

        public string TargetIdentifier { get; set; }

        public DateTime CreatedOn { get; set; }

        public long UserId { get; set; }

        public int Version { get; set; }
    }
}
