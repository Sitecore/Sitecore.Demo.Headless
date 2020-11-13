[CmdletBinding()]
Param(
    [string[]]$Folders = @(
        ".\data\cd\logs",
        ".\data\cd\src",
        ".\data\cm\logs",
        ".\data\cm\src",
        ".\data\solr",
        ".\data\sql"
        ".\data\xconnect\logs",
        ".\data\xconnect\src",
        ".\data\xdbautomationworker\logs",
        ".\data\xdbautomationworker\src",
        ".\data\xdbsearchworker\logs",
        ".\data\xdbsearchworker\src"
    )
)

foreach ($folder in $Folders)
{
    Get-ChildItem -Path (Resolve-Path $folder) -Recurse | Remove-Item -force -recurse -Exclude ".gitignore", ".gitkeep", "*.pem", "certs_config.yaml"
}

Get-ChildItem .\data -Recurse | Remove-Item -Force -Recurse -Exclude ".gitignore", ".gitkeep", "*.pem", "certs_config.yaml"