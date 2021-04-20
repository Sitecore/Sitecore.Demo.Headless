using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using Azure.Security.KeyVault.Secrets;

using OrderCloud.SDK;

using Sitecore.Integrations.OrderCloud.Functions.Factories.Interfaces;

using Stylelabs.M.Sdk.WebClient;
using Stylelabs.M.Sdk.WebClient.Authentication;

namespace Sitecore.Integrations.OrderCloud.Functions.Factories
{
    // TODO [ILs] Add some caching for Clients
    public class DefaultClientFactory : IClientFactory
    {
        private const string _OrderCloudClientClientIdSecretName = "OrderCloudClient-ClientId";

        private const string _OrderCloudClientClientSecretSecretName = "OrderCloudClient-ClientSecret";

        private const string _OrderCloudClientApiUrlSecretName = "OrderCloudClient-ApiUrl";

        private const string _OrderCloudClientAuthUrlSecretName = "OrderCloudClient-AuthUrl";

        private const string _WebMClientClientIdSecretName = "WebMClient-ClientId";

        private const string _WebMClientClientSecretSecretName = "WebMClient-ClientSecret";

        private const string _WebMClientUserNameSecretName = "WebMClient-UserName";

        private const string _WebMClientPasswordSecretName = "WebMClient-Password";

        private static readonly Regex _AllExceptAlphaNumericalCharactersAndHyphen = new Regex("[^a-z0-9-]", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private readonly SecretClient _secretClient;

        public DefaultClientFactory(SecretClient secretClient)
        {
            _secretClient = secretClient;
        }

        public IWebMClient CreateWebMClient(Uri sourceSystem)
        {
            Task<string> clientId = GetSecretValueAsString(_WebMClientClientIdSecretName, sourceSystem);
            Task<string> clientSecret = GetSecretValueAsString(_WebMClientClientSecretSecretName, sourceSystem);
            Task<string> userName = GetSecretValueAsString(_WebMClientUserNameSecretName, sourceSystem);
            Task<string> password = GetSecretValueAsString(_WebMClientPasswordSecretName, sourceSystem);
            Task.WaitAll(clientId, clientSecret, userName, password);
            OAuthPasswordGrant oauth = new OAuthPasswordGrant
                                           {
                                               ClientId = clientId.Result,
                                               ClientSecret = clientSecret.Result,
                                               UserName = userName.Result,
                                               Password = password.Result
                                           };

            return MClientFactory.CreateMClient(sourceSystem, oauth);
        }

        public IOrderCloudClient CreateOrderCloudClient(Uri sourceSystem)
        {
            Task<string> clientId = GetSecretValueAsString(_OrderCloudClientClientIdSecretName, sourceSystem);
            Task<string> clientSecret = GetSecretValueAsString(_OrderCloudClientClientSecretSecretName, sourceSystem);
            Task<string> apiUrl = GetSecretValueAsString(_OrderCloudClientApiUrlSecretName, sourceSystem);
            Task<string> authUrl = GetSecretValueAsString(_OrderCloudClientAuthUrlSecretName, sourceSystem);
            Task.WaitAll(clientId, clientSecret);
            return new OrderCloudClient(
                new OrderCloudClientConfig
                    {
                        ClientId = clientId.Result,
                        ClientSecret = clientSecret.Result,
                        Roles = new[]
                                    {
                                        ApiRole.CatalogAdmin,
                                        ApiRole.CategoryAdmin,
                                        ApiRole.PriceScheduleAdmin,
                                        ApiRole.ProductAdmin,
                                        ApiRole.ProductAssignmentAdmin,
                                        ApiRole.ProductFacetAdmin
                                    },
                        GrantType = GrantType.ClientCredentials,
                        ApiUrl = apiUrl.Result,
                        AuthUrl = authUrl.Result
                    });
        }

        private static string GetSecretPrefix(Uri sourceSystem)
        {
            return _AllExceptAlphaNumericalCharactersAndHyphen.Replace(sourceSystem.DnsSafeHost, "-");
        }

        private async Task<string> GetSecretValueAsString(string name, Uri sourceSystem)
        {
            string prefix = GetSecretPrefix(sourceSystem);
            name = $"{prefix}-{name}";
            KeyVaultSecret secret = await _secretClient.GetSecretAsync(name);
            return secret.Value;
        }
    }
}
