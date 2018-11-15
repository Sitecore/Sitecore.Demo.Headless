#$citiesFile = Receive-File -Path "C:\temp\worldcities"
$citiesFile = "C:\temp\worldcities.csv\worldcities.csv"
$cities = Import-Csv $citiesFile | select city_ascii, country, iso2, admin_name, lat, lng | Where-object {$_.iso2 -eq "CA"} | ConvertTo-Json | ConvertFrom-Json

$sport = "golf" # possible values golf, basketball, running, cycling

$modCities = 20 # Modulus factor for selecting a subset of cities (2 = every other city, 5 = every 5 cities)
$maxEvents = 1 # Maximum number of events per city.

$rootPath = "master://content/habitatfitness/home/events/"

$origin = Get-Item ("master://content/habitatfitness/sample-events/{0}-event-template" -f $sport)
$images = Get-ChildItem ("master://media library/Project/habitatfitness/assets/events/{0}" -f $sport)

$baseDescriptions = @{}

$baseDescriptions.basketball = @(
    "3x3 is vital in the development and growth of the sport of basketball in {country}. Join us in {city} at {event} and sharpen your skills.",
    "Street Hoops {country} invites you to fun and inclusive events where you can hone and show off your skills. Sign up for the {event} in {city} now!"
)
$baseDescriptions.running = @(  "This is the race event of the year for {city}. Challenge yourself to a {event} and join others with the same goals.",
    "Starting and finishing in {city}, you will be rewarded with stunning views. Join the {event} and visit the beauty of {city}",
    "Experience {city}'s diversity and beauty with a {event} that touches all aspects of its culture, and finishes with one hella awesome party."
    "The {city} {event} takes participants past {city}'s historic buildings for a {distance} tour of some of {city}'s biggest landmarks.",
    "The {city} {event} is the only Gold Label {event} event in {country} and one of only four  Gold Label {event}s in the world. The {city} {event} attracts one of the world's best fields of pro runners as well as thousands of participants from across the  Region. The race is also home to the {event} Championships.",
    "The {city} {event} is {country}'s largest and fastest {event}. One of two Gold Label {event} events in {country}, the race attracts thousands of participants, including a world-class contingent of pro athletes every year. The {city} {event} is one of {country}'s largest Qualifiers.",
    "The {city} {event} course is a scenic tour through the {city}, passing notable neighborhoods and attractions"
)
$baseDescriptions.golf = @(
    "Enjoy the breathtaking view of this course in the city of {city} in {country}. Opening with a beautiful par-five featuring majestic pines down the right hand side, the golf course gives you a hint of what to expect.",
    "For a golfer, there is no better experience than a fabulous golf course in a spectacular setting. Truly, this is what {city} Country Club has to offer. From rolling, open land to holes cut out of the forest, this amazing design, ranked as 'Best in State' provides the beauty and challenge every golfer demands. Six choices of tees and impeccable course conditions enable golfers of all skill levels to equally enjoy the course.",
    "{city} course was named the Best Public Golf Course last year, Best Layout, Best Conditioning, and it had the Best Greens and the Best Par-4 (No. 1). More importantly, it also had the Best Customer Service!"
)
$baseDescriptions.cycling = @(
    "The race in {city} starts at the old railway station and heads north on West Creek Road. Take a left onto Upper Fairfield Drive and continue straight until taking a right on Honeypot Rd. Follow Honeypot north to a 4-way intersection and take a right. Follow 76 Rd back to West Creek road and take that back to the start. The finishing line is at the Railway Crossing sign about a hundred yards south of the starting area.",
    "{city} Road Race. To get to the start, go up RT 38 and turn left on West Creek road, follow for 1/2 mile to start/finish area. Course goes out West Creek 5 miles, left turn on Back West Creek, then another immediate right puts you back on West Creek. Finish is at the Rail Road Crossing sign.",
    "A  hilly road race course starting near the fishing access parking lot in Port Crane. The finish is an orange cone  a few hundred yards before the Fireside Inn {city}."
)
    
Function GetRandomDate {

    [DateTime]$theMin = [DateTime]::Now.AddMonths(1)
    [DateTime]$theMax = [DateTime]::Now.AddYears(2)
 
    $theRandomGen = new-object random
    $theRandomTicks = [Convert]::ToInt64( ($theMax.ticks * 1.0 - $theMin.Ticks * 1.0 ) * $theRandomGen.NextDouble() + $theMin.Ticks * 1.0 )
    $randomDate = (new-object DateTime($theRandomTicks)).ToString("yyyyMMdd")
    return ("{0}T000000Z" -f $randomDate)
}

Function GetOrCreateCityFolder {
    param(
        [string] $BasePath,
        [string] $Country,
        [string] $Province,
        [string] $City
    )
    $countryPath = ("{0}/{1}" -f $BasePath, $Country.Replace(' ','-').ToLower())
    
    if (!(Test-Path -Path $countryPath)) {
        # Create Country
         New-Item -Path $countryPath -ItemType "/Common/Folder" > $null
        $countryItem = Get-Item $countryPath
        $countryItem.Editing.BeginEdit() > $null
        $countryItem["__Display name"] = $Country
        $countryItem.Editing.EndEdit() > $null

    }
    

    $provincePath = ("{0}/{1}" -f $countryPath, $Province.Replace(' ','-').ToLower())
    if (!(Test-Path -Path $provincePath)) {
        New-Item -Path $provincePath -ItemType "/Common/Folder" > $null
        $provinceItem = Get-Item $provincePath
        $provinceItem.Editing.BeginEdit() > $null
        $provinceItem["__Display name"] = $Province
        $provinceItem.Editing.EndEdit() > $null
    }
    $cityPath = ("{0}/{1}" -f $provincePath, $City.Replace(' ','-').Replace("'","").ToLower())
    if (!(Test-Path -Path $cityPath)) {
         New-Item -Path $cityPath -ItemType "/Common/Folder" > $null
         $cityItem = Get-Item $cityPath
         
         $cityItem.Editing.BeginEdit() > $null
        $cityItem["__Display name"] = $City
        $cityItem.Editing.EndEdit() > $null
    }
    return $cityPath.ToString()
}

$citiesParsed = 0
foreach ($city in $cities) {
    if (($citiesParsed % $modCities) -ne 0) {
        $citiesParsed++
        continue
    }
    Write-Host ("Creating event(s) for {0}" -f $city.city_ascii)
    $citiesParsed++
    ### Set up some settings for this event
   
    $cityNameNoAccents = [Text.Encoding]::ASCII.GetString([Text.Encoding]::GetEncoding("Cyrillic").GetBytes($city.city_ascii)).Replace("'", "").Replace(".", "")
    $provinceNoAccents = [Text.Encoding]::ASCII.GetString([Text.Encoding]::GetEncoding("Cyrillic").GetBytes($city.admin_name))
    $countryNoAccents = [Text.Encoding]::ASCII.GetString([Text.Encoding]::GetEncoding("Cyrillic").GetBytes($city.country))
    
    $cityName = $city.city_ascii
    $destinationPath = ""
    $destinationPath = GetOrCreateCityFolder -BasePath $rootPath -Country $countryNoAccents -Province $provinceNoAccents -City $cityNameNoAccents
    
    $destination = Get-Item $destinationPath #-ErrorAction SilentlyContinue -ErrorVariable myError
  
    # Let's create on or more events per city, at most 5
    if (1 -ne $maxEvents) {
        $numberofEvents = Get-Random -Minimum 1 -Maximum $maxEvents
    }
    else {
        $numberofEvents = 1
    }
    
    $randomParticipants = $null
    $eventType = $null
    $randomDistance = 0
    
    for ($i = 0; $i -lt $numberOfEvents; $i++) {
        switch ($sport) {
            "basketball" {
                $randomParticipants = 3
                $eventType = Get-Random -InputObject "3 on 3 Basketball drop-in", "3 on 3 Basketball Challenge", "Basketball Tournament"
                break
            }
            "running" {
                $randomDistance = Get-Random -InputObject 2, 5, 10, 21, 42  
                $randomParticipants = Get-Random -InputObject "500-1K", "500-2500", "unlimited"
                switch ($randomDistance) {
                    2 {
                        $eventType = '2K Run'
                    }
                    5 {
                        $eventType = '5K Run'
                    }
                    10 {
                        $eventType = '10K Run'
                    }
                    21 {
                        $eventType = "Half Marathon"
                    }
                    42 {
                        $eventType = "Marathon"
                    }
                }
                break
            }
            "golf" {
                $randomParticipants = Get-Random -InputObject 24, 50, 100, 150
                $eventType = "Golf Tournament"
                break
            }
            "cycling" {
                $randomDistance = Get-Random -InputObject 10, 25, 50, 100
                $randomParticipants = Get-Random -InputObject 100, 250, 500, unlimited
                $eventType = "Cycling Race"
                break
            }
        }
        
        $selectedDescription = Get-Random -Minimum 0 -Maximum ($baseDescriptions.$($sport).Length)    
        $baseDescription = $baseDescriptions.$($sport)[($selectedDescription)]
        $baseLongDescription = "Long Description. " + $baseDescriptions.$($sport)[($selectedDescription)]

        $eventDisplayName = ("{0} {1}" -f $cityNameNoAccents , $eventType)
        $eventName = ("{0}-{1}" -f $cityNameNoAccents.ToLower().Replace(' ', '-'), $eventType.Replace(' ', '-').ToLower())
        $latitude = $city.lat
        $longitude = $city.lng
        $eventDate = GetRandomDate

        $newItem = New-ItemClone -Recursive -Item $origin -Destination $destination
        $newItem.Editing.BeginEdit() > $null
        $newItem."__Display Name" = ("{0}" -f $eventDisplayName.Replace("'", ""))
        $newItem.name = ("{0}" -f $eventName)
        $newItem.pageTitle = $eventDisplayName
        (Get-ItemField -Item $newItem -ReturnType Field -Name latitude).Value = $latitude
        (Get-ItemField -Item $newItem -ReturnType Field -Name longitude).Value = $longitude 
        (Get-ItemField -Item $newItem -ReturnType Field -Name description).Value = $baseDescription.Replace('{city}', $cityName).Replace('{event}', $eventType).Replace('{distance}', $randomDistance).Replace('{country}', $city.country)
        (Get-ItemField -Item $newItem -ReturnType Field -Name longDescription).Value = $baseLongDescription.Replace('{city}', $cityName).Replace('{event}', $eventType ).Replace('{distance}', $randomDistance).Replace('{country}', $city.country)
        (Get-ItemField -Item $newItem -ReturnType Field -Name name).Value = $eventDisplayName
        (Get-ItemField -Item $newItem -ReturnType Field -Name date).Value = $eventDate
        # Set random image
        $newItem.image = $images[(Get-Random -Minimum 0 -Maximum $images.length)]

        $newItem.Editing.EndEdit() > $null
        $newItem.Editing.BeginEdit() > $null
        ### Update the Labels, Get the Id of the label data elements and update the item
        
        
        (Get-Item ("{0}/Data/Labels/Participants" -f $newItem.Paths.Path) ).Value = ("{0}" -f $randomParticipants)
        $participantsLabelId = (Get-Item ("{0}/Data/Labels/Participants" -f $newItem.Paths.Path) ).Id.Guid
        
    
        switch ($sport) {
            "running" {
              
                (Get-Item ("{0}/Data/Labels/Type" -f $newItem.Paths.Path) ).Value = ("{0}" -f $randomType)
                (Get-Item ("{0}/Data/Labels/Distance" -f $newItem.Paths.Path) ).Value = ("{0}km" -f $randomDistance)
                $typeLabelId = (Get-Item ("{0}/Data/Labels/Type" -f $newItem.Paths.Path)).Id.Guid
                $distanceLabelId = (Get-Item ("{0}/Data/Labels/Distance" -f $newItem.Paths.Path)).Id.Guid
                (Get-ItemField -Item $newItem -ReturnType Field -Name labels).Value = ("{0}|{1}|{2}" -f $distanceLabelId.ToString("B").ToUpper(), $participantsLabelId.ToString("B").ToUpper(), $typeLabelId.ToString("B").ToUpper())
                break
            }
            "cycling" {
                $distanceLabelId = (Get-Item ("{0}/Data/Labels/Distance" -f $newItem.Paths.Path)).Id.Guid
                (Get-Item ("{0}/Data/Labels/Distance" -f $newItem.Paths.Path) ).Value = ("{0}km" -f $randomDistance)
                (Get-ItemField -Item $newItem -ReturnType Field -Name labels).Value = ("{0}|{1}" -f $distanceLabelId.ToString("B").ToUpper(), $participantsLabelId.ToString("B").ToUpper())
                break
            }
            default {
                (Get-ItemField -Item $newItem -ReturnType Field -Name labels).Value = ("{0}" -f $participantsLabelId.ToString("B").ToUpper())

            }
            
        }
        # Done editing item
        $newItem.Editing.EndEdit() > $null

        # Disconnect the Clone from its parent

        ConvertFrom-ItemClone -Item $newItem -Recurse
        Write-Host ("Created Event {0}" -f $newItem.Paths.Path)
    }
}
Write-Host "Completed"