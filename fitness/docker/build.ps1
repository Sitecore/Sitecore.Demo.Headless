[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$Build = 3
    ,
    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$Registry = "sitecoredemocontainers.azurecr.io/"
    ,
    [Parameter(Mandatory = $false)]
    [ValidateScript( { Test-Path $_ -PathType "Leaf" })]
    [string]$CmWdpPath = ( ".\*-CM-*.scwdp.zip")
    ,
    [Parameter(Mandatory = $false)]
    [ValidateScript( { Test-Path $_ -PathType "Leaf" })]
    [string]$CdWdpPath = ( ".\*-CD-*.scwdp.zip")
    ,
    [Parameter(Mandatory = $false)]
    [ValidateScript( { Test-Path $_ -PathType "Leaf" })]
    [string]$XConnectWdpPath = (".\*-xConnect-*.zip")
    ,
    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$BuildContext = "windows"
)

$tags = @(
    @{
        "context"    = (Join-Path $PSScriptRoot "..\app");
        "dockerfile" = "dockerfile.windows";
        "wdp"        = $CmWdpPath;
        "tag"        = "habitatfitness-jss-app:9.2.0-windows";
        "options"    = @()
    },
    @{
        "context"    = (Join-Path $PSScriptRoot "..\app");
        "dockerfile" = "dockerfile.linux";
        "wdp"        = $CmWdpPath;
        "tag"        = "habitatfitness-jss-app:9.2.0-linux";
        "options"    = @()
    },
    @{
        "context" = (Join-Path $PSScriptRoot "..\app-node-ssr");
        "wdp"     = $CmWdpPath;
        "tag"     = "habitatfitness-ssr-jss-app:9.2.0-linux";
        "options" = @("--build-arg JSS_IMAGE=$Registry`habitatfitness-jss-app:9.2.0-linux")
    },
    @{
        "context" = (Join-Path $PSScriptRoot "\images\windows\habitatfitness-xp-jss-cd");
        "wdp"     = $CdWdpPath;
        "tag"     = "habitatfitness-xp-jss-cd:9.2.0-windowsservercore-ltsc2019";
        "options" = @("--build-arg BASE_IMAGE=$Registry`sitecore-xp-jss-12.0.0-cd:9.2.0-windowsservercore-ltsc2019 --build-arg JSS_IMAGE=$Registry`habitatfitness-jss-app:9.2.0-windows");
    },
    @{
        "context" = (Join-Path $PSScriptRoot "\images\windows\habitatfitness-xp-jss-standalone");
        "wdp"     = $CmWdpPath;
        "tag"     = "habitatfitness-xp-jss-standalone:9.2.0-windowsservercore-ltsc2019";
        "options" = @("--build-arg BASE_IMAGE=$Registry`sitecore-xp-jss-12.0.0-standalone:9.2.0-windowsservercore-ltsc2019 --build-arg JSS_IMAGE=$Registry`habitatfitness-jss-app:9.2.0-windows");
    },
    @{
        "context" = (Join-Path $PSScriptRoot "\images\windows\habitatfitness-xp-jss-sqldev");
        "wdp"     = $CmWdpPath;
        "tag"     = "habitatfitness-xp-jss-sqldev:9.2.0-windowsservercore-ltsc2019";
        "options" = @(
            "--memory 4GB",
            "--build-arg BASE_IMAGE=$Registry`sitecore-xp-jss-12.0.0-sqldev:9.2.0-windowsservercore-ltsc2019"
        );
    },
    @{
        "context" = (Join-Path $PSScriptRoot "\images\windows\habitatfitness-xp-xconnect");
        "wdp"     = $XConnectWdpPath;
        "tag"     = "habitatfitness-xp-xconnect:9.2.0-windowsservercore-ltsc2019";
        "options" = @("--build-arg BASE_IMAGE=$Registry`sitecore-xp-xconnect:9.2.0-windowsservercore-ltsc2019");
    },
    @{
        "context" = (Join-Path $PSScriptRoot "\images\windows\habitatfitness-xp-xconnect-indexworker");
        "wdp"     = $XConnectWdpPath;
        "tag"     = "habitatfitness-xp-xconnect-indexworker:9.2.0-windowsservercore-ltsc2019";
        "options" = @("--build-arg BASE_IMAGE=$Registry`sitecore-xp-xconnect-indexworker:9.2.0-windowsservercore-ltsc2019");
    },
    @{
        "context" = (Join-Path $PSScriptRoot "\images\windows\habitatfitness-xp-xconnect-automationengine");
        "wdp"     = $XConnectWdpPath;
        "tag"     = "habitatfitness-xp-xconnect-automationengine:9.2.0-windowsservercore-ltsc2019";
        "options" = @("--build-arg BASE_IMAGE=$Registry`sitecore-xp-xconnect-automationengine:9.2.0-windowsservercore-ltsc2019");
    },
    @{
        "context" = (Join-Path $PSScriptRoot "\images\linux\habitatfitness-xp-jss-sql");
        "wdp"     = $CmWdpPath;
        "tag"     = "habitatfitness-xp-sql:9.2.0-linux";
        "options" = @("--build-arg BASE_IMAGE=$Registry`sitecore-xp-jss-12.0.0-sql:9.2.0-linux");
    }
)

$tags | Where-Object { $_.tag -like "*$BuildContext*" } | ForEach-Object {
    $context = (Get-Item $_.context).FullName
    $tag = $_.tag

    $remoteLatestTag = ("{0}{1}" -f $Registry, $tag)
    $remoteBuildTag = ("{0}{1}-v$Build" -f $Registry, $tag)
    $wdp = $_.wdp
    $options = New-Object System.Collections.Generic.List[System.Object]
    $options.Add("--tag '$tag'")
    $options.AddRange($_.options)

    Remove-Item -Path (Join-Path $context "\*.zip")
    Copy-Item -Path $wdp -Destination $context

    $dockerfile = "Dockerfile"
    
    if (-not ([string]::IsNullOrEmpty($_.dockerfile)))
    {
        $dockerfile = $_.dockerfile
    }

    if ("windows" -eq "$BuildContext" )
    {
        $options.Add("--isolation hyperv")
    }

    $command = "docker image build {0} -f {1} '{2}'" -f ($options -join " "), (Join-Path $context $dockerfile), $context

    Write-Verbose ("Invoking: {0} " -f $command) -Verbose

    & ([scriptblock]::create($command))

    $LASTEXITCODE -ne 0 | Where-Object { $_ } | ForEach-Object { throw ("Failed, exitcode was {0}" -f $LASTEXITCODE) }

    docker image tag $tag $remoteLatestTag
    docker image tag $tag $remoteBuildTag
    docker image push $remoteLatestTag
    docker image push $remoteBuildTag
}