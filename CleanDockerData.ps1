[CmdletBinding()]
Param(
    [string[]]$Folders = @(
        ".\data\cd\logs",
        ".\data\cd\src",
        ".\data\cm\logs",
        ".\data\cm\src",
        ".\data\solr-data",
        ".\data\mssql-data",
        ".\data\xconnect\logs",
        ".\data\xconnect\src",
        ".\data\xdbautomationworker\logs",
        ".\data\xdbautomationworker\src",
        ".\data\indexworker\logs",
        ".\data\indexworker\src"
    )
)

foreach ($folder in $Folders)
{
    if (Test-Path -Path $folder) {
        Get-ChildItem -Path (Resolve-Path $folder) -Recurse | Remove-Item -force -recurse -Exclude ".gitignore", ".gitkeep", "*.pem", "certs_config.yaml", "readme.md"
    } else {
        Write-Host "The folder '$folder' does not exist and will not be cleaned." -ForegroundColor Yellow
    }
}

Get-ChildItem .\data -Recurse | Remove-Item -Force -Recurse -Exclude ".gitignore", ".gitkeep", "*.pem", "certs_config.yaml", "readme.md"