# Introduction 
This is the Content Hub - Order Cloud integration.

# Getting Started

1. This instance makes use of the KeyVault found at https://sitecoredemointegrations.vault.azure.net/ if you do not have access make sure to request it or roll your own and adjust your local.settings.json.
   
   The following secrets must be created with as prefix the DNS of your Content Hub Instance with all non alphanumerical altered to a "-". (For example https://ch-pim-ordercloud.stylelabs.io becomes "ch-pim-ordercloud-stylelabs-io")
   - &lt;Prefix&gt;-OrderCloudClient-ClientId
   - &lt;Prefix&gt;-OrderCloudClient-ClientSecret
   - &lt;Prefix&gt;-OrderCloudClient-ApiUrl
   - &lt;Prefix&gt;-OrderCloudClient-AuthUrl
   - &lt;Prefix&gt;-WebMClient-ClientId
   - &lt;Prefix&gt;-WebMClient-ClientSecret
   - &lt;Prefix&gt;-WebMClient-UserName
   - &lt;Prefix&gt;-WebMClient-Password

1. Create a local.settings.json inside the Functions project folder with the following values:
    ```
    {
      "IsEncrypted": false,
      "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet",
        "VaultUri": "https://sitecoredemointegrations.vault.azure.net/"
      }
    }
    ```

1. Run the program, this will give you the endpoint it's listening on.

1. To execute you can use the JSON content below and make sure to pass a suitable `source_system` header (use "https://ch-pim-ordercloud.stylelabs.io" if you just want to see the defaults):
   ```
    {
        "saveEntityMessage": {
            "EventType": "EntityUpdated",
            "TimeStamp": "2021-03-24T11:16:32.707Z",
            "IsNew": false,
            "TargetDefinition": "M.PCM.Product",
            "TargetId": 30500,
            "TargetIdentifier": "De9r0wD5HEmtqpCnUDBxaA",
            "CreatedOn": "2021-03-11T16:13:03.9664777Z",
            "UserId": 30382,
            "Version": 37,
            "ChangeSet": {
                "PropertyChanges": [],
                "Cultures": [
                "(Default)"
                ],
                "RelationChanges": [
                {
                    "Relation": "PCMProductStatusToProduct",
                    "Role": 1,
                    "Cardinality": 0,
                    "NewValues": [
                    30412
                    ],
                    "RemovedValues": [
                    30411
                    ],
                    "inherits_security_original": true,
                    "inherits_security": true
                },
                {
                    "Relation": "MPCMProductToAvailableRoute",
                    "Role": 0,
                    "Cardinality": 1,
                    "NewValues": [
                    30422,
                    30420
                    ],
                    "RemovedValues": [
                    30424,
                    30421
                    ],
                    "inherits_security_original": true,
                    "inherits_security": true
                },
                {
                    "Relation": "MPCMProductToActiveState",
                    "Role": 0,
                    "Cardinality": 1,
                    "NewValues": [
                    30416
                    ],
                    "RemovedValues": [
                    30415
                    ],
                    "inherits_security_original": true,
                    "inherits_security": true
                }
                ],
                "inherits_security_original": true,
                "inherits_security": true,
                "is_root_taxonomy_item_original": false,
                "is_root_taxonomy_item": false,
                "is_path_root_original": false,
                "is_path_root": false,
                "is_system_owned_original": false,
                "is_system_owned": false
            }
        },
        "context": {
            "MappingIdentifier": "D6Ql31wfeUSa7cDzgJLrUQ"
        }
    }
   ```

# Optional Components

1. Create OrderCloud Portal account at https://portal.ordercloud.io/
   - Create an `Admin User`
   - Create a `Security Profile` with `ProductAdmin` role
   - Assign this `Security Profile` to your `Admin User`
   - Create an `API Client` and use the created `Admin User` as the `Default Context User`

1. Create Content Hub Instance at https://create.stylelabs.io/
   - Make sure to include PCM
   - Follow https://docs.stylelabs.com/content/4.0.x/integrations/web-sdk/authentication.html to setup authentication
   - Create an entity that has a JSON property called `MappingJson`
   - Save your mapping as an entity of the prior created type. Example mapping:
     ```
        {
	        "from": "M.PCM.Product",
	        "to": "Product",
	        "targetType": "Product",
	        "propertyMappings": [
		        { "from": "ProductName", "to": "Name", "type": "string" },
		        { "from": "ProductShortDescription", "to": "Description", "type": "string", "culture": "en-US" },
		        { "to": "Active", "type": "bool", "value": "true" },
		        { "to": "QuantityMultiplier", "type": "int", "value": "1" },
		        { "from": "ProductPrice", "to": "PriceBreaks[0].Price", "type": "decimal", "targetType": "PriceSchedule" },
		        { "to": "PriceBreaks[0].Quantity", "type": "int", "targetType": "PriceSchedule", "Value": "1" },
		        { "to": "Name", "type": "string", "targetType": "PriceSchedule", "Value": "Default" }
	        ],
	        "relationMappings": [
		        {
			        "from": "PCMProductToAsset",
			        "to": "xp.Assets",
			        "targetType": "Product",
			        "relationType": "Children",
			        "propertyMappings": [
				        { "from": "Title", "to": "Title", "type": "string" }
			        ],
			        "relationMappings": [
				        {
					        "from": "AssetToPublicLink",
					        "to": "Links",
					        "targetType": "Product",
					        "relationType": "Children",
					        "extensionDataMappings": [
						        { "from": "public_link", "to": "PublicLink", "type": "string" }
					        ]
				        }
			        ]
		        },
		        {
			        "from": "PCMProductToMasterAsset",
			        "to": "xp.MasterAsset",
			        "targetType": "Product",
			        "relationType": "Children",
			        "propertyMappings": [
				        { "from": "Title", "to": "Title", "type": "string" }
			        ],
			        "relationMappings": [
				        {
					        "from": "AssettoPublicLink",
					        "to": "Links",
					        "targetType": "Product",
					        "extensionDataMappings": [
						        { "from": "public_link", "to": "PublicLink", "type": "string" }
					        ]
				        }
			        ]
		        },
		        {
			        "from": "PCMCatalogToProduct",
			        "targetType": "Catalog",
			        "relationType": "Parent",
			        "propertyMappings": [
				        { "from": "CatalogName", "to": "Name", "type": "string" },
				        { "from": "CatalogDescription", "to": "Description", "type": "string", "culture": "en-US" },
				        { "to": "Active", "type": "bool", "value": "true" }
			        ]
		        },
		        {
			        "from": "PCMProductFamilyToProduct",
			        "targetType": "Category",
			        "relationType": "Parent",
			        "propertyMappings": [
				        { "from": "ProductFamilyName", "to": "Name", "type": "string" },
				        { "to": "Active", "type": "bool", "value": "true" }
			        ]
		        }
	        ]
        }
     ```
   - Create an "API call" Action to call your Azure Function (must deploy to Azure Functions to have a public url)
     - Supply a `MappingIdentifier` (Identifier of the mapping entity to use) and `ProductStatusIdFilter` (ID of the only desired ProductStatus to be processed ea "Approved") as Values in the call
   - Create a trigger on product updates and call the created Action

1. Azure Functions account to deploy to