# Sitecore Ingress

## Overview

Description here ...

Validating rendered yaml from Helm chart. Download [kubeval](https://github.com/instrumenta/kubeval/releases/tag/0.13.0) to validate generated yaml against Kubernetes 1.14 definitions.

```bash
$ helm template sitecore-ingress --name sitecore-ingress --namespace sitecore -f sitecore-ingress/values.yaml | kubeval --kubernetes-version 1.14.5

The file sitecore-ingress/templates/tls-secrets.yaml contains a valid Secret
The file sitecore-ingress/charts/nginx-ingress/templates/serviceaccount.yaml contains a valid ServiceAccount
The file sitecore-ingress/charts/nginx-ingress/templates/clusterrole.yaml contains a valid ClusterRole
The file sitecore-ingress/charts/nginx-ingress/templates/clusterrolebinding.yaml contains a valid ClusterRoleBinding
The file sitecore-ingress/charts/nginx-ingress/templates/role.yaml contains a valid Role
The file sitecore-ingress/charts/nginx-ingress/templates/rolebinding.yaml contains a valid RoleBinding
The file sitecore-ingress/charts/nginx-ingress/templates/controller-metrics-service.yaml contains a valid Service
The file sitecore-ingress/charts/nginx-ingress/templates/controller-service.yaml contains a valid Service
The file sitecore-ingress/charts/nginx-ingress/templates/default-backend-service.yaml contains a valid Service
The file sitecore-ingress/charts/nginx-ingress/templates/controller-deployment.yaml contains a valid Deployment
The file sitecore-ingress/charts/nginx-ingress/templates/default-backend-deployment.yaml contains a valid Deployment
The file sitecore-ingress/charts/nginx-ingress/templates/addheaders-configmap.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/controller-configmap.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/controller-daemonset.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/controller-hpa.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/controller-poddisruptionbudget.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/controller-servicemonitor.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/default-backend-poddisruptionbudget.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/podsecuritypolicy.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/proxyheaders-configmap.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/tcp-configmap.yaml contains an empty YAML document
The file sitecore-ingress/charts/nginx-ingress/templates/udp-configmap.yaml contains an empty YAML document
```

## Prerequisites

The Sitecore Demo TLS wildcard certificate must be added to the ingress configuration. The public/private pair and the private key must be PEM encoded.

- **Certificate**: sitecore-ingress-tls.crt
- **Private key**: sitecore-ingress-tls.key

### PEM Format

The PEM format is the most common format that Certificate Authorities issue certificates in. PEM certificates usually have extentions such as .pem, .crt, .cer, and .key. They are Base64 encoded ASCII files and contain "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----" statements. Server certificates, intermediate certificates, and private keys can all be put into the PEM format.

### PKCS#12/PFX Format
The PKCS#12 or PFX format is a binary format for storing the server certificate, any intermediate certificates, and the private key in one encryptable file. PFX files usually have extensions such as .pfx and .p12. PFX files are typically used on Windows machines to import and export certificates and private keys.

When converting a PFX file to PEM format, OpenSSL will put all the certificates and the private key into a single file. You will need to open the file in a text editor and copy each certificate and private key (including the BEGIN/END statments) to its own individual text file and save them as certificate.cer, CACert.cer, and privateKey.key respectively.

### Conversions

> The starting point for these steps assumes access to a sitecore-ingress.wildcard.pfx file and to the `openssl` utility.

**Certificate**

To create the `sitecore-ingress-tls.crt` file, use the following steps:

```bash
# Create the certificate (crt) from the pfx
openssl pkcs12 -in sitecore-ingress.wildcard.pfx -out sitecore-ingress-tls.pem -nodes

# Remove Bag Attributes, i.e the header part of the certificate (crt)
openssl x509 -in sitecore-ingress-tls.pem -out sitecore-ingress-tls.crt

# Verify that the new crt is valid
openssl x509 -in sitecore-ingress-tls.crt -text -noout
```

**Private key**

To create the `sitecore-ingress-tls.key` file, use the following steps:

```bash
# Extract the private key (key) from the certificate (crt)
openssl pkey -in sitecore-ingress-tls.pem -out sitecore-ingress-tls.intermediate.key

# Remove any passphrase from the private key (key)
openssl rsa -in sitecore-ingress-tls.intermediate.key -out sitecore-ingress-tls.key

# Verify that the extracted key is valid
openssl rsa -in sitecore-ingress-tls.key -check
```

**Cleanup**

Remove **ALL** artefacts **EXCEPT** for:
- sitecore-ingress-tls.crt
- sitecore-ingress-tls.key

**Azure Key Vault**

Add the `sitecore-ingress-tls.crt` certificate and `sitecore-ingress-tls.key` private key to Azure KeyVault. Leverage secrets instead of certificate type for now, since we are not leveraging the cert management capabilities of KeyVault and simply want to store the certificate values.

```bash
# Add certificate and private key to Azure KeyVault
az keyvault secret set --vault-name "sitecore-secrets" --name "WildcardCertificate" --file sitecore-ingress-tls.crt
az keyvault secret set --vault-name "sitecore-secrets" --name "WildcardCertPrivateKey" --file sitecore-ingress-tls.key

# Retrieve certificate and private key from Azure KeyVault
az keyvault secret show --vault-name "sitecore-secrets" --name "WildcardCertificate" --query "value" -o tsv
az keyvault secret show --vault-name "sitecore-secrets" --name "WildcardCertPrivateKey" --query "value" -o tsv
```
**Additional details**

More details can be found at:
- https://www.sslshopper.com/article-most-common-openssl-commands.html
- https://www.sslshopper.com/ssl-converter.html
- https://gist.github.com/webtobesocial/5313b0d7abc25e06c2d78f8b767d4bc3
- https://www.freecodecamp.org/news/openssl-command-cheatsheet-b441be1e8c4a/

### Nginx Ingress TLS

More details can be found at: 
- https://kubernetes.github.io/ingress-nginx/user-guide/tls/

## Installation

Install the `sitecore-ingress` into the `sitecore` namespace. 

NOTE: This must from run from within the `helm` toplevel folder if you are running from a local copy of the helm chart.

```bash
helm template sitecore-ingress --name sitecore-ingress --namespace sitecore \
    --set-file tls.certificate=./sitecore-ingress-tls.crt \
    --set-file tls.key=./sitecore-ingress-tls.key \
    | kubectl apply -f - --namespace sitecore
```

Examples
```bash
# No TLS
helm template sitecore-ingress --name jss --namespace sitecore \
    --set nginxingress.controller.service.loadBalancerIP=104.43.132.251 \
    --set nginxingress.controller.service.annotations."service\.beta\.kubernetes\.io\/azure-load-balancer-resource-group"="4.ClusterDeploy" \
    --set nginxingress.controller.service.enableHttp=true \
    --set nginxingress.controller.service.enableHttps=false \
    -f sitecore-ingress/values.yaml \
    | kubectl apply -f - --namespace sitecore

# TLS - from files
helm template sitecore-ingress --name jss --namespace sitecore \
    --set nginxingress.controller.service.loadBalancerIP=104.43.132.251 \
    --set nginxingress.controller.service.annotations."service\.beta\.kubernetes\.io\/azure-load-balancer-resource-group"="4.ClusterDeploy" \
    --set nginxingress.controller.extraArgs.default-ssl-certificate="sitecore/ingress-tls-cert" \
    --set nginxingress.controller.service.enableHttp=false \
    --set nginxingress.controller.service.enableHttps=true \
    --set-file tls.certificate=./sitecore-ingress-tls.crt \
    --set-file tls.key=./sitecore-ingress-tls.key \
    -f sitecore-ingress/values.yaml \
    | kubectl apply -f - --namespace sitecore

# TLS - from Azure KeyVault
helm template sitecore-ingress --name jss --namespace sitecore \
    --set nginxingress.controller.service.loadBalancerIP=104.43.132.251 \
    --set nginxingress.controller.service.annotations."service\.beta\.kubernetes\.io\/azure-load-balancer-resource-group"="4.ClusterDeploy" \
    --set nginxingress.controller.extraArgs.default-ssl-certificate="sitecore/ingress-tls-cert" \
    --set nginxingress.controller.service.enableHttp=false \
    --set nginxingress.controller.service.enableHttps=true \
    --set tls.certificate="$(az keyvault secret show --vault-name 'sitecore-secrets' --name 'WildcardCertificate' --query 'value' -o tsv)" \
    --set tls.key="$(az keyvault secret show --vault-name 'sitecore-secrets' --name 'WildcardCertPrivateKey' --query 'value' -o tsv)" \
    -f sitecore-ingress/values.yaml \
    | kubectl apply -f - --namespace sitecore
```

## Development

If the `nginx-ingress` chart version is updated, then reflect the new version in the `requirements.yaml` file and then pull in copy of `stable/nginx-ingress` to the local charts folder. Run the following from within the `helm/sitecore-ingress` folder.

```bash
helm dependency update
```

### Issue with stable/nginx-ingress sub chart

There needs to be a PR submitted to the stable/nginx-ingress chart, or we pull it into this chart under the charts folder and fix there.

There are a number of clusterIP fields that are passed in as `clusterIP=""` when the value is not provided. Kubernetes does not like this and you need to `kubectl apply -f - --force` to ensure the associated services are correctly applied.

- [[stable/nginx-ingress] Empty controller.service.clusterIP should omit setting clusterIP in service #7782](https://github.com/helm/charts/issues/7782)
- [nginx-ingress: do not set service clusterIP to "" #8221](https://github.com/helm/charts/pull/8221)