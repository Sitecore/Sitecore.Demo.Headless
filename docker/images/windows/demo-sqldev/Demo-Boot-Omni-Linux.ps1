[CmdletBinding()]
param(
	[Parameter(Mandatory = $false)]
	[ValidateNotNullOrEmpty()]
	[string]$SqlHostname = $env:HOSTNAME,
	[string]$sql_scripts = "/sql",
	[string]$scripts = "/opt"
)

function Edit-ExmRootItemBaseUrlFieldValue() {
	# /sitecore/content/lighthousefitness-kiosk/Lighthouse Fitness Kiosk Emails
	$itemParamExmRoot = ("ItemId='5E077689-911B-4073-BDDA-31263A1D88CD'")

	# /sitecore/templates/System/Email/Manager Root/Message Generation/Base URL
	$fieldParamExmRoot = ("FieldId='1B963507-6176-4336-A14D-D5070C3B0286'")
	$valueParamExmRoot = ("Value='" + $env:EXM_KIOSK_CD_BASE_URL + "'")
	$paramsExmRoot = $itemParamExmRoot, $fieldParamExmRoot, $valueParamExmRoot

	$command = Join-Path $sql_scripts "SetSharedFieldValue.sql"
	Invoke-Sqlcmd -InputFile $command -Variable $paramsExmRoot -HostName $SqlHostname -Username sa -Password $env:SA_PASSWORD
	Write-Verbose "$(Get-Date -Format $timeFormat): Edit-ExmRootItemBaseUrlFieldValue - Invoke SetSharedFieldValue.sql"
}

function Edit-FitnessAppBaseUrlInEmailBody() {
	# /sitecore/templates/System/Email/Messages/HTML Message/Message/Body
	$fieldParamAppBaseUrl = ("FieldId='89B7628A-3564-4C9A-8116-DCB15F692573'")
	$tokenParamAppBaseUrl = ("Token='%fitnessAppBaseUrl%'")
	$replacementParamAppBaseUrl = ("Replacement='" + $env:EXM_APP_BASE_URL + "'")

	# /sitecore/content/lighthousefitness-kiosk/Lighthouse Fitness Kiosk Emails/Messages/Send Mobile App Link
	$itemParamAppBaseUrl = ("ItemId='1F841263-93AD-4F66-AA5E-C04D7C277029'")

	$paramsAppBaseUrl = $itemParamAppBaseUrl, $fieldParamAppBaseUrl, $tokenParamAppBaseUrl, $replacementParamAppBaseUrl

	$command = Join-Path $sql_scripts "ReplaceTokenInVersionedFieldValue.sql"
	Invoke-Sqlcmd -InputFile $command -Variable $paramsAppBaseUrl -HostName $SqlHostname -Username sa -Password $env:SA_PASSWORD
	Write-Verbose "$(Get-Date -Format $timeFormat): Edit-FitnessAppBaseUrlInEmailBody - Invoke ReplaceTokenInVersionedFieldValue.sql"
}

function Add-EmailRootToExmRootItems() {
	# /sitecore/system/Settings/Email/System/Root List
	$itemParamExmRoots = ("ItemId='684CAA9A-FBD3-4FFB-891E-042E56B4E09C'")
	# /sitecore/templates/System/Email/Global Settings/Root List/Data/Manager Roots
	$fieldParamExmRoots = ("FieldId='9E4027B2-0360-4B48-B665-FC51E55FC766'")

	# /sitecore/content/lighthousefitness-kiosk/Lighthouse Fitness Kiosk Emails
	$valueParamExmRoots = ("Value='|{5E077689-911B-4073-BDDA-31263A1D88CD}'")

	$paramsExmRoots = $itemParamExmRoots, $fieldParamExmRoots, $valueParamExmRoots

	$command = Join-Path $sql_scripts "AppendToSharedFieldValue.sql"
	Invoke-Sqlcmd -InputFile $command -Variable $paramsExmRoots -HostName $SqlHostname -Username sa -Password $env:SA_PASSWORD
	Write-Verbose "$(Get-Date -Format $timeFormat): Add-EmailRootToExmRootItems - Invoke AppendToSharedFieldValue.sql"
}

function Add-FitnessProfilesToLifestyleSiteProfiles() {
	# /sitecore/content/Demo SXA Sites/LighthouseLifestyle
	$item = ("ItemId='CCC93859-7295-4776-B013-842A7B484932'")
	# /sitecore/templates/Feature/Demo Shared/Demo/_ProfilingSettings/Demo Tools/SiteProfiles
	$field = ("FieldId='2A84ECA4-68BB-4451-B4AC-98EA71A5A3DC'")

	# /sitecore/system/Marketing Control Panel/Profiles/LighthouseFitness/Sports
	$value = ("Value='|{8B3C8714-83CA-41F1-BBF6-FF260F732AAF}'")

	$params = $item, $field, $value

	$command = Join-Path $sql_scripts "AppendToSharedFieldValue.sql"
	Invoke-Sqlcmd -InputFile $command -Variable $params -HostName $SqlHostname -Username sa -Password $env:SA_PASSWORD
	Write-Verbose "$(Get-Date -Format $timeFormat): Add-FitnessProfilesToLifestyleSiteProfiles - Invoke AppendToSharedFieldValue.sql"
}

Write-Host "$(Get-Date -Format $timeFormat): Starting demo team Omni boot override."

Edit-ExmRootItemBaseUrlFieldValue
Edit-FitnessAppBaseUrlInEmailBody
Add-EmailRootToExmRootItems
Add-FitnessProfilesToLifestyleSiteProfiles

Write-Host "$(Get-Date -Format $timeFormat): Demo team Omni boot override complete."
