# escape=`
ARG BASE_IMAGE

FROM $BASE_IMAGE as builder

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

COPY *.zip /install/

RUN $env:WDP_PACKAGE = 'HabitatFitness-xConnect*.zip'; `
    $env:INSTALL_TEMP = 'C:\\install'; `
    Expand-Archive -Path (Join-Path $env:INSTALL_TEMP $env:WDP_PACKAGE) -DestinationPath $env:INSTALL_TEMP; `
    New-Item -Path (Join-Path $env:INSTALL_TEMP "\\Models\\") -ItemType Directory | Out-Null; `
    Copy-Item -Path (Join-Path $env:INSTALL_TEMP "\\xConnectRoot\\App_Data\\Models\\*.*") -Destination (Join-Path $env:INSTALL_TEMP "\\Models") -Force;

FROM $BASE_IMAGE as final

COPY --from=builder ["/install/Models/", "/inetpub/xconnect/App_Data/Models/"]

COPY Boot.ps1 .

ENTRYPOINT [ "powershell", "C:\\Boot.ps1", "C:\\inetpub\\xconnect\\App_Config\\ConnectionStrings.config", "'C:\\ServiceMonitor.exe w3svc xconnect'" ]