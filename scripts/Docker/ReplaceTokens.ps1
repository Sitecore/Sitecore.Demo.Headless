Get-ChildItem env:

Write-Host "Executing ReplaceTokens.ps1, API HOST:" $env:SITECORE_API_HOST

Get-ChildItem C:\deploy\dist *.js -recurse -verbose |
    Foreach-Object {
		Write-Host "Updating " $_.FullName
        $c = ($_ | Get-Content) 
        $c = $c -replace '%layoutServiceHost%', $env:SITECORE_API_HOST
        [IO.File]::WriteAllText($_.FullName, ($c -join "`r`n"))
    }