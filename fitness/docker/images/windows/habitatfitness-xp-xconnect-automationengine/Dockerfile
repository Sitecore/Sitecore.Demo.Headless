# escape=`
ARG BASE_IMAGE

FROM $BASE_IMAGE as builder

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

COPY *.zip /install/

RUN $env:WDP_PACKAGE = 'HabitatFitness-xConnect*.zip'; `
    $env:INSTALL_TEMP = 'C:\\install'; `
    Expand-Archive -Path (Join-Path $env:INSTALL_TEMP $env:WDP_PACKAGE) -DestinationPath $env:INSTALL_TEMP; `
    New-Item -Path (Join-Path $env:INSTALL_TEMP "\\AutomationEngine") -ItemType Directory | Out-Null; `
    Copy-Item -Path (Join-Path $env:INSTALL_TEMP "\\xConnectAutomationServiceRoot\\*.*") -Destination (Join-Path $env:INSTALL_TEMP "\\AutomationEngine") -Recurse -Force;

FROM $BASE_IMAGE as final

COPY --from=builder ["/install/AutomationEngine/", "/AutomationEngine/"]

COPY Boot.ps1 .

ENTRYPOINT [ "powershell", "C:\\Boot.ps1", "C:\\AutomationEngine\\App_Config\\ConnectionStrings.config", "C:\\AutomationEngine\\maengine.exe" ]
