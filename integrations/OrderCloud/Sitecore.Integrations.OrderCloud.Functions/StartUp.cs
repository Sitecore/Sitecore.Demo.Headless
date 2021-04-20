using System;

using Azure.Identity;

using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.DependencyInjection;

using Sitecore.Integrations.OrderCloud.Functions.Factories;
using Sitecore.Integrations.OrderCloud.Functions.Factories.Interfaces;

using Stylelabs.M.Sdk.WebClient;

[assembly: FunctionsStartup(typeof(Sitecore.Integrations.OrderCloud.Functions.StartUp))]

namespace Sitecore.Integrations.OrderCloud.Functions
{
    public class StartUp : FunctionsStartup
    {
        private const string _KeyVaultUriEnvKey = "VaultUri";

        public override void Configure(IFunctionsHostBuilder builder)
        {
            WebDefaults.RetryAfterPolicy.RetryCount = int.MaxValue;

            builder.Services.AddAzureClients(clientBuilder =>
                {
                    // Add a KeyVault client
                    // ReSharper disable once AssignNullToNotNullAttribute - Throwing is acceptable.
                    clientBuilder.AddSecretClient(new Uri(Environment.GetEnvironmentVariable(_KeyVaultUriEnvKey)));

                    // Use the environment credential by default
                    clientBuilder.UseCredential(new DefaultAzureCredential());
                });

            builder.Services.AddSingleton<IClientFactory, DefaultClientFactory>();
        }
    }
}
