# The script sets the sa password and start the SQL Service
# Also it attaches additional database from the disk
# The format for attach_dbs

param(
	[Parameter(Mandatory = $false)]
	[string]$sa_password,

	[Parameter(Mandatory = $false)]
	[string]$ACCEPT_EULA,

	[Parameter(Mandatory = $false)]
	[string]$attach_dbs
)

if ($ACCEPT_EULA -ne "Y" -And $ACCEPT_EULA -ne "y") {
	Write-Host "ERROR: You must accept the End User License Agreement before this container can start."
	Write-Host "Set the environment variable ACCEPT_EULA to 'Y' if you accept the agreement."

	exit 1
}

# start the service
Write-Host "Starting SQL Server"
start-service MSSQLSERVER

if ($sa_password -eq "_") {
	if (Test-Path $env:sa_password_path) {
		$sa_password = Get-Content -Raw $secretPath
	}
	else {
		Write-Host "WARN: Using default SA password, secret file not found at: $secretPath"
	}
}

if ($sa_password -ne "_") {
	Write-Host "Changing SA login credentials"
	$sqlcmd = "ALTER LOGIN sa with password=" + "'" + $sa_password + "'" + ";ALTER LOGIN sa ENABLE;"
	& sqlcmd -Q $sqlcmd
}

# override

Write-Host "$(Get-Date -Format $timeFormat): Starting demo team boot override."

$ready = Invoke-Sqlcmd -Query "select name from sys.databases where name = 'platform_init_ready'"
if (-not $ready) {
	Invoke-Sqlcmd -Query "create database platform_init_ready"

	Write-Host "$(Get-Date -Format $timeFormat): Starting demo team Headless boot override."

	function CreateAdminUser
	{
		Param(
			[string] $username,
			[string] $password
		)

		if ([string]::IsNullOrEmpty($username) -or [string]::IsNullOrEmpty($password))
		{
			Write-Warning "There was no username or password provided. Not creating admin user."
			return $null
		}

		$userinfoAdmin = ./HashPassword.ps1 $password

		$passwordParamAdmin = ("EncodedPassword='" + $userinfoAdmin.Password + "'")
		$saltParamAdmin = ("EncodedSalt='" + $userinfoAdmin.Salt + "'")
		$UserNameParamAdmin = ("UserName='" + $username + "'")
		$EMailParamAdmin = ("EMail='noreply@sitecoredemo.com'")
		$paramsAdmin = $passwordParamAdmin, $saltParamAdmin, $UserNameParamAdmin, $EMailParamAdmin

		Invoke-Sqlcmd -InputFile "C:\sql\CreateSitecoreAdminUser.sql" -Variable $paramsAdmin
		Write-Host "$(Get-Date -Format $timeFormat): Invoke CreateSitecoreAdminUser.sql for $username"
	}

	# create new admin user if specified
	$adminUserName = $env:ADMIN_USER_NAME
	if ($null -ne $adminUserName -AND $adminUserName.ToLower() -ne "admin" ) {
		CreateAdminUser $adminUserName $env:SITECORE_ADMIN_PASSWORD
	}

	# disable admin user, if specified
	if ($env:DISABLE_DEFAULT_ADMIN -eq $TRUE ) {
		Invoke-Sqlcmd -InputFile "C:\sql\DisableSitecoreAdminUser.sql"
		Write-Host "$(Get-Date -Format $timeFormat): Invoke DisableSitecoreAdminUser.sql"
	}
	else {
		# reset OOB admin password, to match SHA512 *and* in case a new one was specified
		$userinfoAdmin = ./HashPassword.ps1 $env:SITECORE_ADMIN_PASSWORD

		$passwordParamAdmin = ("EncodedPassword='" + $userinfoAdmin.Password + "'")
		$saltParamAdmin = ("EncodedSalt='" + $userinfoAdmin.Salt + "'")
		$paramsAdmin = $passwordParamAdmin, $saltParamAdmin

		Invoke-Sqlcmd -InputFile "C:\sql\SetAdminPassword.sql" -Variable $paramsAdmin
		Write-Host "$(Get-Date -Format $timeFormat): Invoke SetAdminPassword.sql"
	}

	# Remove setting the admin password from the ootb StartStandalone.ps1 script as it uses SHA1
	(Get-Content .\StartStandalone.ps1) -replace ".\\SetSitecoreAdminPassword.ps1", "# .\SetSitecoreAdminPassword.ps1" | Set-Content .\StartStandalone.ps1

	# alter demo users, and set new password
	$userinfo = ./HashPassword.ps1 $env:USER_PASSWORD
	$passwordParam = ("EncodedPassword='" + $userinfo.Password + "'")
	$saltParam = ("EncodedSalt='" + $userinfo.Salt + "'")
	$paramsUser = $passwordParam, $saltParam

	Invoke-Sqlcmd -InputFile "C:\sql\ResetDemoUsers.sql" -Variable $paramsUser
	Write-Host "$(Get-Date -Format $timeFormat): Invoke ResetDemoUsers.sql"

	Write-Host "$(Get-Date -Format $timeFormat): Demo team Headless boot override complete."
}

# set datafolder
.\SetSqlServerDataFolder.ps1 -DataDirectory $env:DATA_PATH -Verbose

# set acl
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("NT AUTHORITY\NETWORKSERVICE","FullControl","Allow")
$acl = Get-Acl -Path $env:DATA_PATH
$acl.SetAccessRule($accessRule)
$acl | Set-Acl -Path $env:DATA_PATH

Write-Host "$(Get-Date -Format $timeFormat): Demo team boot override complete, calling StartStandalone.ps1!"

# start
.\StartStandalone.ps1 -ResourcesDirectory $env:RESOURCES_PATH -InstallDirectory $env:INSTALL_PATH -DataDirectory $env:DATA_PATH -sa_password $sa_password -sitecore_admin_password $env:sitecore_admin_password -ACCEPT_EULA $ACCEPT_EULA -attach_dbs $attach_dbs -sql_server $env:sql_server  -Verbose
