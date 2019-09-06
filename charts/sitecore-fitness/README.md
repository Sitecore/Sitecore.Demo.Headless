# Sitecore Fitness

## Overview 

TODO: Add description and details here ...

Validating rendered yaml from Helm chart. Download [kubeval](https://github.com/instrumenta/kubeval/releases/tag/0.13.0) to validate generated yaml against Kubernetes 1.14 definitions.

```bash
$ helm template sitecore-fitness --name h3emy4dylr --namespace h3emy4dylr -f sitecore-fitness/values.yaml | kubeval --kubernetes-version 1.14.5

The file sitecore-fitness/templates/keyvault-secret.yaml contains a valid Secret
The file sitecore-fitness/templates/secret.yaml contains a valid Secret
The file sitecore-fitness/templates/solr-pvc.yaml contains a valid PersistentVolumeClaim
The file sitecore-fitness/templates/app-serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-fitness/templates/contentdelivery-serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-fitness/templates/contentmanager-serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-fitness/templates/solr-serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-fitness/templates/sql-serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-fitness/templates/xconnect-automationengine-serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-fitness/templates/xconnect-indexworker-serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-fitness/templates/xconnect-serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-fitness/templates/app-service.yaml contains a valid Service
The file sitecore-fitness/templates/contentdelivery-service.yaml contains a valid Service
The file sitecore-fitness/templates/contentmanager-service.yaml contains a valid Service
The file sitecore-fitness/templates/solr-service.yaml contains a valid Service
The file sitecore-fitness/templates/sql-service.yaml contains a valid Service
The file sitecore-fitness/templates/xconnect-service.yaml contains a valid Service
The file sitecore-fitness/templates/app-deployment.yaml contains a valid Deployment
The file sitecore-fitness/templates/contentdelivery-deployment.yaml contains a valid Deployment
The file sitecore-fitness/templates/contentmanager-deployment.yaml contains a valid Deployment
The file sitecore-fitness/templates/solr-deployment.yaml contains a valid Deployment
The file sitecore-fitness/templates/sql-deployment.yaml contains a valid Deployment
The file sitecore-fitness/templates/xconnect-automationengine-deployment.yaml contains a valid Deployment
The file sitecore-fitness/templates/xconnect-deployment.yaml contains a valid Deployment
The file sitecore-fitness/templates/xconnect-indexworker-deployment.yaml contains a valid Deployment
The file sitecore-fitness/templates/ingress.yaml contains a valid Ingress
```

## Deploying and Testing

### Dependencies

The helm chart has a depedency on the following:
- AKS Cluster with Linux and Windows pools
- Azure Disk created per demo

Here is how to create the Azure Disk for a demo. You will need to save the name and the resourceId and use them for the `sql.storage.disk.name` and `sql.storage.disk.uri` in the `values.yaml` file. 
```

$ az aks show --resource-group AKS-MixedWorkload --name aks-mixedworkload --query nodeResourceGroup -o tsv
MC_AKS-MixedWorkload_aks-mixedworkload_australiaeast

$ az disk create \
  --resource-group MC_AKS-MixedWorkload_aks-mixedworkload_australiaeast \
  --name h3emy4dylr-sqldata \
  --os-type Linux \
  --size-gb 5 \
  --sku Premium_LRS \
  --tags kubernetes.io-created-for-namespace=h3emy4dylr kubernetes.io-created-for-workload=sql \
  --query id --output tsv
/subscriptions/5383262f-8b7d-4506-9079-65965e5583fe/resourceGroups/MC_AKS-MixedWorkload_aks-mixedworkload_australiaeast/providers/Microsoft.Compute/disks/h3emy4dylr-sqldata
```

## Installation

Install the `sitecore-fitness` chart into a unique namespace. In the example below, that is `h3emy4dylr`.

NOTE: This must from run from within the `helm` toplevel folder if you are running from a local copy of the helm chart.

The values in the template are default values and typically will not have to be modified when deploying a demo. The values in the example below, however, are required to be supplied per demo installation.

Example

```bash
helm template sitecore-fitness --name h3emy4dylr --namespace h3emy4dylr \
    --set global.ingress.host.cd="h3emy4dylr.sitecore.com" \
    --set global.ingress.host.cm="h3emy4dylr-cm.sitecore.com" \
    --set global.ingress.host.app="h3emy4dylr-app.sitecore.com"
    --set globabl.secrets.SqlServerSaPassword="supersecurep@ssword!!" \
    --set globabl.secrets.SitecoreSqlUsername="sitecore" \
    --set globabl.secrets.SitecoreSqlPassword="supersecurep@ssword!!" \
    --set globabl.secrets.SitecoreAdminUsername="sitecoreadmin" \
    --set globabl.secrets.SitecoreAdminPassword="supersecurep@ssword!!" \
    --set globabl.secrets.ApplicationInsightsKey="somelongapplicationinsightskey" \
    --set sql.storage.disk.name="h3emy4dylr-sqldata" \
    --set sql.storage.disk.uri="/subscriptions/5383262f-8b7d-4506-9079-65965e5583fe/resourceGroups/MC_AKS-MixedWorkload_aks-mixedworkload_australiaeast/providers/Microsoft.Compute/disks/h3emy4dylr-sqldata" \
    -f sitecore-fitness/values.yaml \
    | kubectl apply -f - --namespace h3emy4dylr
```

## Components

The base tag for images without a "-v#" version suffix will use the latest version available. For production it is recommended to select a specific version tag.

### SQL Server

- node type: linux
- image: sitecoreakshack.azurecr.io/habitathome-xp-sql:9.2.0-linux
- resources: service, deployment, pvc, secret, service account

> TODO:
> 
> - sa password should come from Azure Key Vault not from secret. SQL Server image expects the password to be projected as ENV - file based option via kubernetes-keyvault-flexvol is not supported directly by SQL Server image. We could project contents of file into ENV on execution of `boot.sh` ?
> - role and rolebinding that leverages the service account
> - pod security policy
> - network policy ?
> - prometheus metrics exported - https://github.com/free/sql_exporter

### Solr

- node type: linux
- image: sitecoreakshack.azurecr.io/sitecore-xp-sxa-1.9.0-solr:9.2.0-linux
- resources: service, deployment, pvc, service account

> TODO:
>  
> - role and rolebinding that leverages the service account
> - pod security policy
> - network policy ?
> - prometheus metrics exporter service and deployment (bin and conf available in image already) - https://github.com/lucidworks/solr-helm-chart/blob/master/solr/templates/exporter-deployment.yaml

```bash
$ opt/solr/contrib/prometheus-exporter/bin/solr-exporter --port 8983 --num-threads 1

solr@37bece26b4c9:/opt/solr/contrib/prometheus-exporter/bin$ ./solr-exporter --help
usage: SolrCollector [-h] [-p PORT] [-b BASE_URL] [-z ZK_HOST] [-f CONFIG] [-n NUM_THREADS]

Prometheus exporter for Apache Solr.

named arguments:
  -h, --help             show this help message and exit
  -p PORT, --port PORT   Specify the solr-exporter HTTP listen port; default is 9983.
  -b BASE_URL, --baseurl BASE_URL
                         Specify the Solr base URL when connecting to Solr in standalone mode. If omitted both the -b parameter and the -z parameter, connect to http://localhost:8983/solr. For example 'http://localhost:8983/solr'.
  -z ZK_HOST, --zkhost ZK_HOST
                         Specify the ZooKeeper connection string when connecting to Solr in SolrCloud mode. If omitted both the -b parameter and the -z parameter, connect to http://localhost:8983/solr. For example 'localhost:2181/solr'.
  -f CONFIG, --config-file CONFIG
                         Specify the configuration file; default is ./conf/solr-exporter-config.xml.
  -n NUM_THREADS, --num-threads NUM_THREADS
                         Specify the number of threads. solr-exporter creates a thread pools for request to Solr. If you need to improve request latency via solr-exporter, you can increase the number of threads; default is 1.
solr@37bece26b4c9:/opt/solr/contrib/prometheus-exporter/bin$ 
```

### Content Manager (CM)

- node type: windows
- image: sitecoreakshack.azurecr.io/habitathome-xp-standalone:9.2.0-windowsservercore-ltsc2019
- resources: service, deployment, service account

> TODO:
> - role and rolebinding that leverages the service account
> - pod security policy
> - network policy ?
> - configuration for database connection string and app insights ?
> - sidecar for logging (fluentbit) ?
> - liveness and readiness probes ?

### Content Delivery (CD)

- node type: windows
- image: sitecoreakshack.azurecr.io/habitathome-xp-cd:9.2.0-windowsservercore-ltsc2019
- resources: service, deployment, service account

> TODO:
> - role and rolebinding that leverages the service account
> - pod security policy
> - network policy ?
> - configuration for database connection string and app insights ?
> - sidecar for logging (fluentbit) ?
> - liveness and readiness probes ?

### xConnect Server 

- node type: windows
- image: sitecoreakshack.azurecr.io/habitathome-xp-xconnect:9.2.0-windowsservercore-ltsc2019
- resources: service, deployment, service account

> TODO:
> - role and rolebinding that leverages the service account
> - pod security policy
> - network policy ?
> - configuration for database connection string and app insights ?
> - configuration for certificates - sidecar injection from Azure Key Vault ?
> - sidecar for logging (fluentbit) ?
> - liveness and readiness probes ?

### xConnect Processing 

- node type: windows
- image: sitecoreakshack.azurecr.io/sitecore-xp-xconnect-automationengine:9.2.0-windowsservercore-ltsc2019
- resources: deployment, service account

> TODO:
> - role and rolebinding that leverages the service account
> - pod security policy
> - network policy ?
> - configuration for database connection string and app insights ?
> - sidecar for logging (fluentbit) ?

### xConnect Indexer 

- node type: windows
- image: sitecoreakshack.azurecr.io/habitathome-xp-xconnect-indexworker:9.2.0-windowsservercore-ltsc2019
- resources: deployment, service account

> TODO:
> - role and rolebinding that leverages the service account
> - pod security policy
> - network policy ?
> - configuration for database connection string and app insights ?
> - sidecar for logging (fluentbit) ?