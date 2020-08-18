[CmdletBinding()]
param(
	[Parameter(Mandatory = $false)]
	[ValidateNotNullOrEmpty()]
	[string]$SqlHostname = $env:HOSTNAME,
	[string]$sql_scripts = "/sql",
	[string]$scripts = "/opt"
)

# For Linux container

$timeFormat = "HH:mm:ss:fff"

function Edit-ExmRootItemBaseUrlFieldValue() {
	# /sitecore/content/lighthousefitness-kiosk/Lighthouse Fitness Kiosk Emails
	$itemParamExmRoot = ("ItemId='5E077689-911B-4073-BDDA-31263A1D88CD'")

	# /sitecore/templates/System/Email/Manager Root/Message Generation/Base URL
	$fieldParamExmRoot = ("FieldId='1B963507-6176-4336-A14D-D5070C3B0286'")
	$valueParamExmRoot = ("Value='" + $env:EXM_KIOSK_CD_BASE_URL + "'")
	$paramsExmRoot = $itemParamExmRoot, $fieldParamExmRoot, $valueParamExmRoot

	$command = Join-Path $sql_scripts "SetSharedFieldValue.sql"
	Invoke-Sqlcmd -InputFile $command -Variable $paramsExmRoot -HostName $SqlHostname -Username sa -Password $env:SA_PASSWORD
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

	$command = Join-Path $sql_scripts "ReplaceTokenInVersionedFieldValue.sql"
	Invoke-Sqlcmd -InputFile $command -Variable $paramsAppBaseUrl -HostName $SqlHostname -Username sa -Password $env:SA_PASSWORD
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

	$command = Join-Path $sql_scripts "AppendToSharedFieldValue.sql"
	Invoke-Sqlcmd -InputFile $command -Variable $paramsExmRoots -HostName $SqlHostname -Username sa -Password $env:SA_PASSWORD
	Write-Verbose "$(Get-Date -Format $timeFormat): Invoke AppendToSharedFieldValue.sql"
}

Edit-ExmRootItemBaseUrlFieldValue
Edit-FitnessAppBaseUrlInEmailBody
Add-EmailRootToExmRootItems

Write-Host "$(Get-Date -Format $timeFormat): Demo team Omni boot override complete."
