# Sitecore.HabitatHome.Omni
This repository is used to share Sitecore JSS PWA demo assets (and future “Sitecore Omni” related demo assets) Status (Public or Private)

Assumptions
    Your current site's "main" hostname is habitathome.dev.local
    You also have a binding (w/ SSL) (and hosts entry) to habitatfitness.dev.local

Deploy server bits

    cd /fitness/server
    .\build.ps1
    
Deploy app

    cd /fitness/app
    jss deploy config
    jss deploy files
