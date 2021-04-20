using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Primitives;

using Newtonsoft.Json;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.Messages
{
    public class Message
    {
        private const string _SourceSystemHeaderName = "source_system";

        private const string _TargetIdHeaderName = "target_id";

        public long? TargetId { get; set; }

        public Context Context { get; set; }

        public StringValues SourceSystem { get; set; }

        public static async Task<T> Parse<T>(HttpRequest req) where T : Message
        {
            T result = JsonConvert.DeserializeObject<T>(await req.ReadAsStringAsync());
            result.SourceSystem = req.Headers[_SourceSystemHeaderName];
            if (result.TargetId == null && req.Headers[_TargetIdHeaderName].Any())
            {
                if (long.TryParse(req.Headers[_TargetIdHeaderName].First(), out long parsedTargetId))
                {
                    result.TargetId = parsedTargetId;
                }
            }

            return result;
        }
    }
}
