[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateScript( { Test-Path $_ -PathType 'Container' })]
  [string]$InstallPath,
  [Parameter(Mandatory = $true)]
  [ValidateScript( { Test-Path $_ -PathType 'Container' })]
  [string]$DataPath,
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$SqlHostname
)

# For Windows container

$timeFormat = "HH:mm:ss:fff"

function Edit-ExmRootItemBaseUrlFieldValue() {
  # /sitecore/content/lighthousefitness-kiosk/Lighthouse Fitness Kiosk Emails
  $itemParamExmRoot = ("ItemId='5E077689-911B-4073-BDDA-31263A1D88CD'")

  # /sitecore/templates/System/Email/Manager Root/Message Generation/Base URL
  $fieldParamExmRoot = ("FieldId='1B963507-6176-4336-A14D-D5070C3B0286'")
  $valueParamExmRoot = ("Value='" + $env:EXM_KIOSK_CD_BASE_URL + "'")
  $paramsExmRoot = $itemParamExmRoot, $fieldParamExmRoot, $valueParamExmRoot

  Invoke-Sqlcmd -InputFile "C:\sql\SetSharedFieldValue.sql" -Variable $paramsExmRoot
  Write-Verbose "$(Get-Date -Format $timeFormat): Invoke SetSharedFieldValue.sql"
}

function Edit-FitnessAppBaseUrlInEmailBody() {
  # /sitecore/templates/System/Email/Messages/HTML Message/Message/Body
  $fieldParamAppBaseUrl = ("FieldId='89B7628A-3564-4C9A-8116-DCB15F692573'")
  $tokenParamAppBaseUrl = ("Token='%fitnessAppBaseUrl%'")
  $replacementParamAppBaseUrl = ("Replacement='" + $env:EXM_APP_BASE_URL + "'")

  # /sitecore/content/lighthousefitness-kiosk/Lighthouse Fitness Kiosk Emails/Messages/Send Mobile App Link
  $itemParamAppBaseUrl = ("ItemId='1F841263-93AD-4F66-AA5E-C04D7C277029'")

  $paramsAppBaseUrl = $itemParamAppBaseUrl, $fieldParamAppBaseUrl, $tokenParamAppBaseUrl, $replacementParamAppBaseUrl

  Invoke-Sqlcmd -InputFile "C:\sql\ReplaceTokenInVersionedFieldValue.sql" -Variable $paramsAppBaseUrl
  Write-Verbose "$(Get-Date -Format $timeFormat): Invoke ReplaceTokenInVersionedFieldValue.sql"
}

function Add-EmailRootToExmRootItems() {
  # /sitecore/system/Settings/Email/System/Root List
  $itemParamExmRoots = ("ItemId='684CAA9A-FBD3-4FFB-891E-042E56B4E09C'")
  # /sitecore/templates/System/Email/Global Settings/Root List/Data/Manager Roots
  $fieldParamExmRoots = ("FieldId='9E4027B2-0360-4B48-B665-FC51E55FC766'")

  # /sitecore/content/lighthousefitness-kiosk/Lighthouse Fitness Kiosk Emails
  $valueParamExmRoots = ("Value='|{5E077689-911B-4073-BDDA-31263A1D88CD}'")

  $paramsExmRoots = $itemParamExmRoots, $fieldParamExmRoots, $valueParamExmRoots

  Invoke-Sqlcmd -InputFile "C:\sql\AppendToSharedFieldValue.sql" -Variable $paramsExmRoots
  Write-Verbose "$(Get-Date -Format $timeFormat): Invoke AppendToSharedFieldValue.sql"
}

if ( (Get-ChildItem -Path $DataPath -Exclude ".gitkeep").Count -gt 0) {
  Write-Host "$(Get-Date -Format $timeFormat): Data files found. Reattaching SQL Data files."
  & C:\Boot.ps1 -InstallPath $InstallPath -DataPath $DataPath -SqlHostname $SqlHostname;
}
else {
  # call Platform's boot override script to prepare the sql container. Skip the start-up.
  & C:\Demo-Boot-Override.ps1 -InstallPath $InstallPath -DataPath $DataPath -SqlHostname $SqlHostname -SkipStart;

  Edit-ExmRootItemBaseUrlFieldValue
  Edit-FitnessAppBaseUrlInEmailBody
  Add-EmailRootToExmRootItems

  Write-Host "$(Get-Date -Format $timeFormat): Demo team Omni boot override complete."
  Write-Host "$(Get-Date -Format $timeFormat): Databases ready!"
  & C:\Start.ps1 -sa_password $env:sa_password -ACCEPT_EULA $env:ACCEPT_EULA -attach_dbs \"$env:attach_dbs\" -Verbose
}