Write-Host "Executing ReplaceCMTokens.ps1, API HOST:" $env:PROXY_API_HOST

Get-ChildItem C:\inetpub\wwwroot\dist *.js -recurse -verbose |
    Foreach-Object {
        Write-Host "Updating " $_.FullName
        $c = ($_ | Get-Content)

        $c = $c -replace '%OC_BUYER_CLIENT_ID%', $env:OC_BUYER_CLIENT_ID
        $c = $c -replace '%OC_BASE_API_URL%', $env:OC_BASE_API_URL

        $c = $c -replace '%BOXEVER_PROXY_URL%', $env:BOXEVER_PROXY_URL
        $c = $c -replace '%boxeverClientKey%', $env:REACT_APP_BOXEVER_CLIENT_KEY

        $c = $c -replace '%layoutServiceHost%', $env:PROXY_API_HOST

        $c = $c -replace '%firebaseMessagingSenderId%', $env:REACT_APP_FIREBASE_SENDER_ID
        $c = $c -replace '%firebaseMessagingPushKey%', $env:REACT_APP_FIREBASE_MESSAGING_PUSH_KEY
        $c = $c -replace '%firebaseProjectId%', $env:REACT_APP_FIREBASE_PROJECT_ID
        $c = $c -replace '%firebaseApiKey%', $env:REACT_APP_FIREBASE_API_KEY
        $c = $c -replace '%firebaseAppId%', $env:REACT_APP_FIREBASE_APP_ID

        $c = $c -replace '%googleApiKey%', $env:REACT_APP_GOOGLE_API_KEY

        [IO.File]::WriteAllText($_.FullName, ($c -join "`r`n"))
    }