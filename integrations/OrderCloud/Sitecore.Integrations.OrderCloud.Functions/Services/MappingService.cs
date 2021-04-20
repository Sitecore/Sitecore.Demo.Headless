using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using Newtonsoft.Json.Linq;

using Sitecore.Integrations.OrderCloud.Functions.Models.Mappings;

using Stylelabs.M.Sdk.Contracts.Base;
using Stylelabs.M.Sdk.WebClient;

namespace Sitecore.Integrations.OrderCloud.Functions.Services
{
    public class MappingService
    {
        private const string _MappingProperty = "MappingJson";

        private readonly IWebMClient _client;

        private readonly ILogger _log;

        public MappingService(IWebMClient client, ILogger log)
        {
            _client = client;
            _log = log;
        }

        public async Task<EntityMapping> GetMapping(string identifier)
        {
            EntityMapping result = null;
            IEntity mappingEntity = await _client.Entities.GetAsync(identifier);
            if (mappingEntity != null)
            {
                JObject mappingJson = mappingEntity.GetPropertyValue<JObject>(_MappingProperty);
                result = mappingJson.ToObject<EntityMapping>();
            }
            else
            {
                _log.LogError($"MappingService: No mapping found for identifier {identifier}");
            }
            
            return result;
        }
    }
}
