[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$Build = 3
    ,
    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$Registry = "sitecoreaks.azurecr.io/"
)

$ErrorActionPreference = "STOP"
$ProgressPreference = "SilentlyContinue"

$namespace = "sitecore-habitatfitness"

kubectl set image deployment/cm cm=$registry`habitatfitness-xp-jss-standalone:9.2.0-windowsservercore-ltsc2019-v$build --namespace $namespace
kubectl set image deployment/cd cd=$registry`habitatfitness-xp-jss-cd:9.2.0-windowsservercore-ltsc2019-v$build --namespace $namespace
kubectl set image deployment/sql sql=$registry`habitatfitness-xp-jss-sql:9.2.0-linux-v$build --namespace $namespace
kubectl set image deployment/xconnect xconnect=$registry`habitatfitness-xp-xconnect:9.2.0-windowsservercore-ltsc2019-v$build --namespace $namespace
kubectl set image deployment/indexworker indexworker=$registry`habitatfitness-xp-xconnect-indexworker:9.2.0-windowsservercore-ltsc2019-v$build --namespace $namespace
kubectl set image deployment/automationengine automationengine=$registry`habitatfitness-xp-xconnect-automationengine:9.2.0-windowsservercore-ltsc2019-v$build --namespace $namespace