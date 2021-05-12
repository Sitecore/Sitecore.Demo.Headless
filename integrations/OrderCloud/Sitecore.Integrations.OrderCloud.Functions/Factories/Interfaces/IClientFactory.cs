using System;

using OrderCloud.SDK;

using Stylelabs.M.Sdk.WebClient;

namespace Sitecore.Integrations.OrderCloud.Functions.Factories.Interfaces
{
    public interface IClientFactory
    {
        public IWebMClient CreateWebMClient(Uri sourceSystem);

        public IOrderCloudClient CreateOrderCloudClient(Uri sourceSystem);
    }
}
