using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using OrderCloud.SDK;

using Sitecore.Integrations.OrderCloud.Functions.Models.Mappings;

using Stylelabs.M.Sdk.WebClient;

namespace Sitecore.Integrations.OrderCloud.Functions.Services
{
    public class ProductService
    {
        private readonly IWebMClient _webMClient;

        private readonly IOrderCloudClient _orderCloudClient;

        private readonly ILogger _log;

        private readonly MapperService _mapper;

        private readonly OrderCloudService _orderCloud;

        private readonly MappingService _mappingService;

        public ProductService(IWebMClient webMClient, IOrderCloudClient orderCloudClient, ILogger log)
        {
            _webMClient = webMClient;
            _orderCloudClient = orderCloudClient;
            _log = log;
            _mapper = new MapperService(_webMClient, _log);
            _orderCloud = new OrderCloudService(_orderCloudClient, _log);
            _mappingService = new MappingService(_webMClient, _log);
        }

        public async Task UpdateProduct(long id, string mappingIdentifier)
        {
            EntityMapping mapping = await _mappingService.GetMapping(mappingIdentifier);
            await UpdateProduct(id, mapping);
        }

        public async Task UpdateProduct(long id, EntityMapping mapping)
        {
            MapResult mapResult = await _mapper.MapProduct(id, mapping);
            _orderCloud.ProcessMapResult(mapResult);
        }
    }
}
