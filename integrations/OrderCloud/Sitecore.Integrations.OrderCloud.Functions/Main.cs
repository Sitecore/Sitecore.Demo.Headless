using System;
using System.Threading.Tasks;
using System.Web.Http;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

using OrderCloud.SDK;

using Sitecore.Integrations.OrderCloud.Functions.Factories.Interfaces;
using Sitecore.Integrations.OrderCloud.Functions.Models.Messages;
using Sitecore.Integrations.OrderCloud.Functions.Services;

using Stylelabs.M.Sdk.WebClient;

namespace Sitecore.Integrations.OrderCloud.Functions
{
    public class Main
    {
        private readonly IClientFactory _clientFactory;

        public Main(IClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        [FunctionName("UpdateCatalog")]
        public async Task<IActionResult> RunUpdateCatalog([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
        {
            IActionResult result = new OkResult();
            try
            {
                Message message = await Message.Parse<Message>(req);
                log.LogInformation($"Processing request for {message.SourceSystem} for target {message.TargetId.Value}");
                await UpdateCatalog(message, log);
            }
            catch (Exception ex)
            {
                log.LogError(ex, ex.Message);
                result = new ExceptionResult(ex, false);
            }

            return result;
        }

        [FunctionName("UpdateProduct")]
        public async Task<IActionResult> RunUpdateProduct([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
        {
            IActionResult result = new OkResult();
            try
            {
                ProductMessage message = await Message.Parse<ProductMessage>(req);
                log.LogInformation($"Processing request for {message.SourceSystem} for target {message.TargetId.Value}");
                await UpdateProduct(message, log);
            }
            catch (Exception ex)
            {
                log.LogError(ex, ex.Message);
                result = new ExceptionResult(ex, false);
            }

            return result;
        }

        private async Task UpdateCatalog(Message message, ILogger log)
        {
            Uri sourceSystem = new Uri(message.SourceSystem);
            IWebMClient webMClient = _clientFactory.CreateWebMClient(sourceSystem);
            IOrderCloudClient orderCloudClient = _clientFactory.CreateOrderCloudClient(sourceSystem);

            CatalogService catalogService = new CatalogService(webMClient, orderCloudClient, log);
            if (message.TargetId.HasValue)
            {
                await catalogService.UpdateCatalog(message.TargetId.Value, message.Context.MappingIdentifier, message.Context.ProductStatusIdFilter);
            }
            else
            {
                log.LogWarning("UpdateCatalog was called without a valid TargetId.");
            }
        }

        private async Task UpdateProduct(Message message, ILogger log)
        {
            Uri sourceSystem = new Uri(message.SourceSystem);
            IWebMClient webMClient = _clientFactory.CreateWebMClient(sourceSystem);
            IOrderCloudClient orderCloudClient = _clientFactory.CreateOrderCloudClient(sourceSystem);

            ProductService productService = new ProductService(webMClient, orderCloudClient, log);
            if (message.TargetId.HasValue)
            {
                await productService.UpdateProduct(message.TargetId.Value, message.Context.MappingIdentifier);
            }
            else
            {
                log.LogWarning("UpdateProduct was called without a valid TargetId.");
            }
        }
    }
}
