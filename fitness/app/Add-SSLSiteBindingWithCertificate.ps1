Param(
    [string] $SiteName = "habitathome.dev.local",
    [string] $JssHostName = "habitatfitness.dev.local"
)

function Add-SSLSiteBindingWithCertificate {
    try {
        $params = @{
            SiteName    = $SiteName 
            JssHostName = $JssHostName 
        }

        Set-HostsEntry -IPAddress 127.0.0.1 -HostName 'habitatfitness.dev.local'
        write-host "Hosts entry set for" $params.JssHostName -ForegroundColor Green

        $certPersonal = Get-ChildItem -Path "cert:\LocalMachine\My\" | Where-Object { $_.subject -eq "CN=habitatfitness.dev.local" }
        if ($null -ne $certPersonal)
        {
            write-host "Certificate already installed in 'cert:\LocalMachine\My\' store for" $params.JssHostName -ForegroundColor Yellow
        }
        else 
        {
            $certPersonal = New-SelfSignedCertificate -DnsName $params.JssHostName -CertStoreLocation "cert:\LocalMachine\My"
            write-host "Certificate added to 'cert:\LocalMachine\My\' store for" $params.JssHostName -ForegroundColor Green
        }

        $certRoot = Get-ChildItem -Path "cert:\LocalMachine\Root\" | Where-Object { $_.subject -eq "CN=habitatfitness.dev.local" }
        if ($null -ne $certRoot)
        {
            write-host "Certificate already installed in 'cert:\LocalMachine\Root\' store for" $params.JssHostName -ForegroundColor Yellow
        }
        else 
        {
            Copy-Item -Path cert:\LocalMachine\My\$certPersonal.Thumbprint -Destination cert:\LocalMachine\Root\
            write-host "Certificate copied to 'cert:\LocalMachine\Root\' store for" $params.JssHostName -ForegroundColor Green
        }

        $bindingStandard = Get-WebBinding -Name $params.SiteName -Port 80 -HostHeader $params.JssHostName
        if ($null -ne $bindingStandard)
        {
            write-host "Binding for port 80 already exists for" $params.HostName -ForegroundColor Yellow
        }
        else
        {
            New-WebBinding -Name $params.SiteName -IPAddress "*" -Port 80 -HostHeader $params.JssHostName
            write-host "Binding added to port 80 for" $params.JssHostName -ForegroundColor Green
        }

        $bindingSsl = Get-WebBinding -Name $params.SiteName -Port 443 -HostHeader $params.JssHostName
        if ($null -ne $bindingSsl)
        {
            write-host "Binding for port 443 already exists for" $params.JssHostName -ForegroundColor Yellow
        }
        else
        {
            New-WebBinding -Name $params.SiteName -IPAddress "*" -Port 443 -HostHeader $params.JssHostName -Protocol "https"
            write-host "Binding added to port 443 for" $params.JssHostName -ForegroundColor Green
        }

        $bind = Get-WebBinding -Name $params.SiteName -Protocol "https"
        $bind.AddSslCertificate($certPersonal.GetCertHashString(), "my")
        write-host "Certificate attached to binding on port 443 for" $params.JssHostName -ForegroundColor Green
    }
    catch {
        write-host "Binding and certificate Setup Failed" -ForegroundColor Red
        throw
    }
}

Add-SSLSiteBindingWithCertificate
