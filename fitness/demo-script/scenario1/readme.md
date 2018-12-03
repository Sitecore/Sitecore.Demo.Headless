# Demo scenario 1

## Objective

Showing Progressive Web App setup, deep dive into app front-end code in React and how it is put together. Talk about ability to work with the app disconnected from Sitecore on any platform (MacOS or Linux). Finally, demonstrate the ease of app deployment into a vanilla instance of Sitecore via JSS CLI.

> This scenario assumes that some features depending on Sitecore instance operation won't be available, this includes app registration, event signup, favoriting and subscription. At this moment, only services related to content delivery are mocked in disconnected mode.

## Audience:

Front-end developers and full-stack developers proficient in JavaScript and modern UI libs and frameworks.

## Scene 1. Intro

### Pre-requisites

- node.js installed (the latest LTS release) with latest npm. To check, run `node -v` and `npm -v`.
- [Acquire Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key). This is not a hard requirement as it is only needed for the Google Maps component to render on even detail screen.
  > Please do not forget to restrict this API key to your origins.

### Setup

Prior to the demo, recommended going through the [Sitecore JSS architecture and building blocks](https://jss.sitecore.com/docs/fundamentals/architecture) doc.

### Flow

1. `npm install @sitecore-jss/sitecore-jss-cli -g`
   > Installing Sitecore JSS CLI globally, we would need it at later stages. Make sure v11.0.0 of this package is installed (run `jss --version` to confirm).
   > If it is installed previously, skip this step.
1. `cd repo/fitness/app`
1. `npm install` to install all app dependencies.
1. Create `.env` file next to `package.json` and add the following environment variable with your own Google API key obtained above:

   ```
   REACT_APP_GOOGLE_API_KEY=<insert-yours-here>
   ```

1. `jss start`

   The app is expected to render in your default browser on `http://localhost:3000`.

   > From the demo perspective, it is highly recommended using either Chrome or Firefox Quantum for the demo and enable mobile view as the app UX is optimized for mobile.
   > Having React Dev Tools for Chrome installed could be helpful in understanding the app structure.

   This command fires up webpack dev build with dev server and together with the disconnected Layout Service that allows for mocked content in `/data` folder to be served via an http endpoint proxied via `http://localhost:3000`.

   > As mentioned above, some API services (registration, data collection, event favoriting, etc.) are not mocked, so it is expected to see some console errors during Personalization and Registration wizard flows.

1. Using any REST API client (Postman for example), make a GET request to the following endpoint: `http://localhost:3000/sitecore/api/layout/render/jss?item=/`

    This is the output for the "Home" route coming from the "mocked" Layout Service API. The main part is the data describing which components need to be loaded on which routes.

1. Change the "item" parameter to `/events/oakland-marathon`. Now you are seeing the "model" for the Oakland Marathon page.

Learn more about the Layout Service [here](https://jss.sitecore.com/docs/fundamentals/services/layout-service#the-sitecore-layout-service).

### Detailed flow

In order to fully understand how the app is put together, it is important to go through:

1. Project structure
1. Application boilerplate
1. Application routes and components

#### Project structure

The project structure should be familiar to anyone who had experience working with Create React App project. The following JSS-specific artifacts are added on top of a CRA project, some are mandatory, others are solely for the code-first development workflow:

1. `/src` folder conventionally contains all the app JavaScript code and React components.

1. `/data` folder contains artifacts for mocked content of various types and is strictly required for the "Code-first" developer experience.

   - `/data/routes`
     mocked route-level (or page-level) content in `.yml` files. YAML is one of the options as this could also be done in JSON or JavaScript. Each file is named according to default content language in Sitecore (`en`) and folder structure is representative of the route structure when the app is integrated with Sitecore. Therefore the `en.yml` file in the root of this folder describes the contents of the "Home" route. Each route file defines the fields and placeholders with the component placed within. Review this section to [understand the component layouting](https://jss.sitecore.com/docs/fundamentals/understanding-layout).

     > During the application import (described later), you have an option to deploy this mocked route level content into Sitecore. It is not deployed by default, to avoid potential content loss, so developers need to explicitly allow it to happen via adding a special `--includeContent` CLI flag to app deployment command.

   - `/data/dictionary`

     This folder contains a file with dictionary mocks in a given content language. One file for language. The contents of this file is loaded on application start and is made available via i18next library from within your components, so developers can translate labels.

     > During the application import (described later), you have an option to deploy this mocked dictionary for a given language into Sitecore. Similar to route-level content, the dictionary is not deployed by default, so developers need to explicitly allow it to happen via adding a special `--includeDictionary` CLI flag to app deployment command.

   - `/data/component-content`

     This folder stores mocked content for _components_ that are shared between routes.

     For example, the component that displays a thank you message from within `/personalize` and `/register` routes has to have a unique `id` defined allowing it to be referenced from other routes.

     ```yml
     id: registration-success
     componentName: RegistrationSuccessStep
     fields:
       title: Thank you for registering.
       stepName: Finish
     ```

     Storing component content inside this folder is optional. It is done to suggest a way to mocked shared components which often become a requirement even on early stages.

   - `/data/content`

     This folder stores mocked content items. These items are often the lookup items for other components. These items are not expected to have any layout associated with them and therefore are not accessible by a friendly url, instead, they are fragments for fields and other components. Within this app, there are 3 usages for content items:

     - event labels (classic lookups)
     - products (container for product items to be displayed in `ProductRecommendationList` component on Home route).
     - sport items (lookups for `SportsPickerStep` component).

   - `/fake-api`

     This folder contains two mocked datasets for `/sitecore/api/habitatfitness/events` and `/sitecore/api/habitatfitness/products` API mocks.
     The two APIs are providing content for the `EventList` and `ProductRecommendationList` components placed on the Home route. The design decision was made to implement these two component sources as separate APIs instead of "baking" the event and product object arrays inside the component data on mocked routes due to the requirements of:

     - retrieving top X events and products from potentially hundreds of content items server-side.
     - returning personalized events and products based on visitor behavior.

     Both requirements may introduce an impractical wait time for the content for these two components. Loading such content asyncronously will improve UX as the UI thread that loads route content from Layout Service won't have to wait for more expensive operation.

     If you are curious about how this is put together, see `scripts/disconnected-mode-proxy.js` file where the two mocked APIs are wired up to JSS' disconnected service that runs the other mocked content services:

     ```js

     const events = require("../data/fake-api/events");
     const products = require("../data/fake-api/products");
     ...
     afterMiddlewareRegistered: app => {
         app.get("/sitecore/api/habitatfitness/events", (req, res) =>
             res.send(events)
         );
         app.get("/sitecore/api/habitatfitness/products", (req, res) =>
             res.send(products)
         );
     }
     ```

     The server-side project contains the "real" implementation of these two APIs that are powered by Sitecore Content Search and an algorithmic personalizaiton based on content profiling.

1. `/sitecore` folder contains the following subfolders:

   - `/config`
     Set of configuration files that have to be deployed to your Sitecore instance for the normal application operation. After you run `jss setup`, there will be an extra .config file in this folder with deploy secret.

   - `/definitions`
     Contains a set of Sitecore definitions for components, routes, templates, etc. This is needed only for "Code-first" developer experience where instead of creaeting artifacts inside the CMS, you do that in JavaScript via JSS manifest API.

     By convention, each file that ends with `sitecore.js` is going to be processed and manifest registration from each will be honored when the complete app manifest is built (via `jss manifest` command).

     If we look at `FeaturedEvent.sitecore.js` file:

     ```js
     export default function(manifest) {
       manifest.addComponent({
         name: "FeaturedEvent",
         displayName: "Featured Event",
         icon: SitecoreIcon.Star,
         fields: [
           { name: "event", type: CommonFieldTypes.ItemLink },
           { name: "label", type: CommonFieldTypes.SingleLineText }
         ]
       });
     }
     ```

     This file contains the definition of the "FeaturedEvent" component that has two fields ("event" and "label").

   - `/manifest`

     This folder acts as a location for the auto-generated `sitecore-import.json` manifest file (after each run of `jss manifest` CLI command). This file will be copied to and processed by Sitecore instance server-side. In addition to the manifest file, all media assets referenced from content fields in `/data` will be copied here.

   - `/package`

     This folder stores an auto-generated package with .zipped manifest folder. It is generated each time you deploy the app.

1. `/assets` folder contains all media assets referenced by the component and therefore will be processed by the manifest and created as Sitecore managed media items in Media Library.

#### Application boilerplate

Before we get to the "meat" of the application structure described below, it's important to understand how the app is wired up, so we have to talk about the boilerplate.

> It's it not the intention of Sitecore JSS toolkit to be opionionated about the application boilerplate, so please think about this as an exmaple of how this can be put together.

##### Application entry

`/src/index.js` is where the "entry" for the application is done.
Please, review the comments to understand the way the app is initialized.

Next component in the hierarchy is `AppRoot`:

```xml
<AppRoot path={window.location.pathname} Router={BrowserRouter} />
```

##### AppRoot

This component wraps the app with `<SitecoreContext>` component that contains instances of `componentFactory` and `SitecoreContextFactory`:

```xml
<SitecoreContext
      componentFactory={componentFactory}
      contextFactory={SitecoreContextFactory}
    >
```

- `ComponentFactory` is a map of component name (string) to component instance in codebase. Auto-generated on build (see `/scripts/generate-component-factory.js`).

- `SitecoreContextFactory` stores the current Sitecore context for the app and updated on route change.

- `SitecoreContext` makes the `ComponentFactory` and `SitecoreContextFactory`available to `<Placeholder />` component (described below). This is crucial for the placeholder to be able to locate the component instances in the codebase, pass correct props to them and render them via React APIs.

Let's look at the "body" of the AppRoot component (simplified) that is using React Router:

```xml
<Router location={path} context={{}}>
    <Switch>
        {routePatterns.map(routePattern => (
            <Route
                key={routePattern}
                path={routePattern}
                render={props => 
                    <RouteHandler route={props} />}
            />
        ))}
    </Switch>
</Router>
```

Basically, for each route in `routePatterns` that are setup for multi-lingual routing, `<RouteHandler />` will be invoked.

##### RouteHandler

The job of route handler, as the name suggest, is to handle routes.
This is where most of the heavy lifting is done in terms of:
1. Fetching route data from Layout Service
1. Updating route data when language parameter changes in URL
1. Hydrating server-side route data injected into the page during SSR.
1. Handling `<NotFound />` component render if no route is foind:
    ```javascript

    if (notFound) {
      return (
        <div>
          <Helmet>
            <title>{i18n.t("Page not found")}</title>
          </Helmet>
          <NotFound />
        </div>
      );
    }
    ```

1. Rendering of the `<Loading />` component when the route data is still being loaded:
    ```javascript
    if (!routeData || this.languageIsChanging) {
        return <Loading />;
    }
    ```
1. Finally, rendering of the `<Layout />` component with the data that comes from Layout Service:

    ```xml
        <Layout {...routeData.sitecore} />;
    ```

##### Layout

This is the "app shell" component that contains:
- page header using React Helmet and `t()` Higher-order component from `react-i18next` package that allows for the use of the dictionary data:
    ```xml
        <Helmet>
          <title>{`${t("habitat-fitness")} | ${pageTitle}`}</title>
        </Helmet>
    ```
- placeholder for navigation:
    ```xml
    <Placeholder
          name="hf-nav"
          rendering={route}
          routeData={route}
          context={context}
    />
    ```

- placeholder for page body:
    ```xml
    <main role="main">
        ...
        <Placeholder
            name="hf-body"
            rendering={route}
            routeData={route}
            context={context} />
        </main>
    ```

The `<Placeholder />` component is imported from `sitecore-jss-react` package:
```javascript
import { Placeholder } from "@sitecore-jss/sitecore-jss-react";
```

These two placeholders will be responsible for rendering of the actual components based on mocked route data. Read more about placeholders in [docs](https://jss.sitecore.com/docs/client-frameworks/react/react-placeholders#what-are-placeholders).

#### Application routes and components

The application consists of the following routes:

#### Home route

This route consists of the following components:

- `FeaturedEvent`

  Renders a single given event teaser information. After app integration, the data for this component will be personalzed via Sitecore Rules Engine.

  The content for this component comes from component placement on Home route level, which is disconnected mode is defined in `/data/routes/en.yml` file:

  ```yml
  - componentName: FeaturedEvent
    fields:
      event:
        id: tiburon-half-marathon
      label: Recommended for you
  ```

  This component has two fields: `event`, which is a link to the event content item that is being featured. The references by `id` is established explicitly, which is a requirement for content references in disconnected.
  The event is a route-level item itself: `data\routes\events\tiburon-half-marathon\en.yml`.

  The `label` field is a text field that controls the yellow label text next to featured event image.

- `EventList`

  Featching data from `/sitecore/api/habitatfitness/events` endpoint (mocked in disconnected mode) and renders the list of events based on user behavior. After app integration this list will be powered by algorithmic personalization based on scoring.

  Notice that this component stores a single field that displays the title. This way the content for the component is a responsibility of a separate API while meta-data and marketing content for this component is the responsibility of the component itself:

  ```yml
  fields:
    title: Events near you
  ```

- `ProductRecommendationList`
  Similar to `EventList` component above, this component is featching data from `/sitecore/api/habitatfitness/products` endpoint (mocked in disconnected mode) and renders the list of recommended products based on user behavior. After app integration this list will be powered by algorithmic personalization based on scoring.

  Notice that this component stores a single field that displays the title. This way the content for the component is a responsibility of a separate API while meta-data and marketing content for this component is the responsibility of the component itself:

  ```yml
  fields:
    title: Gear just for you
  ```

#### `/events` routes

Representative of the event detail pages, the mocked content for these routes is stored under `/data/routes/events/event-name` folders.

Let's take the "tiburon-half-marathon" route-level item as example:

```yml
id: tiburon-half-marathon
url: /events/tiburon-half-marathon
displayName: Tiburon Half Marathon
template: event-page
fields:
  pageTitle: Tiburon Half Marathon
  name: Tiburon Half Marathon
  description: Starting and finishing ...
  longDescription: Long description...
  date: "2018-10-29T08:00:00.000Z"
  latitude: 37.873221
  longitude: -122.455438
  image:
    src: /assets/events/tiburon-half-marathon.jpg
  labels:
    - id: road-type-label
      copy: true
    - id: participants-label
      copy: true
    - id: distance-label
      copy: true
placeholders:
  hf-nav:
    - componentName: DetailNavigation
  hf-body:
    - id: event-detail-anonymous
```

Event routes have a certain duality in them. They are both route-level items that have route-level fields, and layout with two placeholders (`hf-nav` and `hf-body`), but also serve as source items for other components, such as `FeaturedEvent` component above
that displays a featured event by referencing event route item by id:

```yml
- componentName: FeaturedEvent
 fields:
   event:
       id: tiburon-half-marathon
```

The id used by the `FeaturedEvent` component above matches the id on the route-level item:

```yml
id: tiburon-half-marathon
url: /events/tiburon-half-marathon
```

The event routes have two components placed, each inside its own placeholder:

```yml
hf-nav:
  - componentName: DetailNavigation
```

The `DetailNavigation` component renders one of the two types of navigations supported by the app. This one contains the "back" button and renders the name of the page. In contrast, the `Navigation` component that is placed on the "Home" route renders navigation links.

> In some cases, if there is only one version of app navigation, developers may find it more appropriate to define it within another components (the usual React way) instead of being placed via a placeholder, which has the benefits of 1) being able to swap out a Navigation component at runtime based on business user actions 2) personalize the navigation 3) apply multi-variate testing to navigation.

The other component is connected to `hf-body` placeholder:

```yml
hf-body:
  - id: event-detail-anonymous
```

This is a reference to the `EventDetailAnonymous` component declaration defined in `/data/component-content/event-detail-anonymous`:

```yml
id: event-detail-anonymous
name: event-detail-anonymous
displayName: Event Detail (Anonymous)
componentName: EventDetailAnonymous
fields:
  ctaText: Register to Signup
  ctaLink:
    href: /register
```

This declaration specifies the following:

1. An instance of `EventDetailAnonymous` react component will be rendered within the `hf-body` placeholder.
1. The following `fields` object will be passed as `props` to the instance of `EventDetailAnonymous` component:

```yml
fields:
  ctaText: Register to Signup
  ctaLink:
    href: /register
```

`name` and `displayName` are properties that will control the way this component and its data source content is created in Sitecore after app deployment.

There are 3 variations of the "event detail" component:

1.  `EventDetailAnonymous`:
    Shown for anonymous visitors:
    - show "register before you can sign up" button.
    - present information relevant to visitors that haven't signed up for the event yet.
1.  `EventDetailLoggedIn`:
    For identified (logged in) visitors that haven't signed up yet for the event:
    - offer to favorite the event
    - offer to sign up to the event
1.  `EventDetailRegistered`:
    For identified (logged in) visitors that _also_ signed up for the given event:
    - offer to subscribe to the notifications
    - offer to get the directions
    - show countdown towards event date
    - present alternative event description that is more relevant to the visitors that signed up for the given event.

There is a requirement to have Sitecore Rules Engine drive the switching between these 3 variations. Since the Rules Engine is not available in disconnected environment, different variances are bound to different event routes. Therefore, the "oakland-marathon" route is using the `EventDetailLoggedIn` variance instead:

```yml
hf-body:
  - id: event-detail-loggedin
```

This way developers can test their component placement without running Sitecore instance.

#### '/personalization' route

This route is a "wizard" that walks the user through the personalizaiton flow. The route definition stored under `/data/routes/personalize`.

The "wizard" consists of 4 steps:

1. Collect sport preferences (`SportsPickerStep` component).
1. Collect demographics data (`PersonalDataStep` component).
1. Offer to save the data as account (`SaveAsAccountStep` component).
1. Show "registration was successful" message (`RegistrationSuccessStep` component).

Steps 1-2 are used to collect user data for personalization and will be stored in xDB as custom contact facets when the app is integrated with Sitecore XP.

The Step 1 is the only one that requires the user to enter the data before proceeding, other steps offer to "skip".

Each step of the wizard is a component placed within the `hf-personalization-wizard` placeholder:

```yml
hf-personalization-wizard:
  - id: sports-picker
  - componentName: PersonalDataStep
    ...
  - componentName: SaveAsAccountStep
  - id: registration-success
```

As you can see, a variation of techniques is used:

- Direct component placement with the field content (for #2 and #3).
- References to centrally stored components (for #1 and #4) since the app is sharing those between `/personalization` and `/register` routes.

Another interesting aspect about this route is that it contains a nested placeholder within `hf-personalization-wizard`:

```yml
hf-personalization-wizard:
  - componentName: PersonalDataStep
    ...
    placeholders:
      hf-createaccount-form:
        - id: gender-selector
        - id: age-group-selector
```

This nested placeholder named `hf-createaccount-form` is declared within `PersonalDataStep.js` component (details excluded for brevity):

```xml
...
<div className="fields">
  <Placeholder name="hf-createaccount-form"
      rendering={rendering}
      onChange={this.handleChange} />
</div>
...
```

This allows adding new form components in addition to `gender-selector` and `age-group-selector` and even personalize this particular step of the wizard.

#### '/register' route

This route is a "wizard" that walks the user through the registration flow and shares most of the components with the "Personalization" flow described above. The route definition stored under `/data/routes/register`.

The mechanics of this route are quite similar to the `/personalize` route described above. The difference in behavior is that there are 3 steps instead of 4, some steps are mandatory to complete and that the order of the components is different.

#### Wildcard routes

The app is enabled with wildcard routing using React Router, so each new `en.yml` file in corresponding folder will be served from within the app as a new route.

## Scene 2. Adding a new component

Now that we understand the application setup, let's add a new feature for our app - a "hello world" component.

### Pre-requisites

Same as Scene 1 above.

### Setup

Scene 1 complete.

### Flow

1. Let's add a new component. This component won't do much, just display some heading.
1. Run `jss scaffold DemoComponent`.
   Two files will be created - the react.js source file for the component: `src\components\DemoComponent\index.js` and the corresponding component definition file: `sitecore\definitions\components\DemoComponent.sitecore.js`
1. Open the definition file and notice that the component adds the only field called "heading" of type "single line text":
   ```javascript
    { name: 'heading', type: CommonFieldTypes.SingleLineText }
   ```
1. Open `src\components\DemoComponent\index.js` and notice that this is a fairly simple react component that simply renders the "heading" field as a prop using `<Text />` field helper from `sitecore-jss-react` SDK:

   ```javascript
   const DemoComponent = props => (
     <div>
       <p>DemoComponent Component</p>
       <Text field={props.fields.heading} />
     </div>
   );
   ```

1. Let's add this component to our Home route.
   Open `/data/routes/en.yml` and add the component to the `hf-home` placeholder after the `FeaturedEvent` component:

   ```yml
       - componentName: FeaturedEvent
         fields:
         ...
       - componentName: DemoComponent
         fields:
           heading: Hello World
   ```

   > Please notice the identation, it is very important that the `DemoComponent` appears at the same level as `FeaturedEvent` component.

After you save the Home route file, the component is expected to be rendered.

## Scene 3. First app bootstrapping with Sitecore

### Pre-requisites
1. Complete API key setup described [here].(https://github.com/Sitecore/Sitecore.HabitatHome.Omni/tree/master/fitness/app#connecting-3rd-party-api-services)
1. Complete code-first deployment pre-requisites described [here](https://github.com/Sitecore/Sitecore.HabitatHome.Omni/tree/master/fitness/app#pre-requisites-1).

### Setup
Complete pre-reqs and assuming scene 1-2 were complete.

### Flow

1. Run `jss manifest –includeContent –includeDictionary` or `jss manifest -c -d` for short.

1. `sitecore-import.json` file will be created under `sitecore/manifest` folder. This file describes in Sitecore Domain Language what kind of application artifacts need to be created for this application.

1. Complete all the steps described [here](https://github.com/Sitecore/Sitecore.HabitatHome.Omni/tree/master/fitness/app#steps).

    The console will show the app deployment progress that the Sitecore artifacts are created and we see what's been done in real time.

1. 	Launch Sitecore CMS and notice the items created in the content tree under `/sitecore/content/habitatfitness` along with dictionary items, component items and other artifacts.

1. Launch the Home page in Experience Editor and notice that the Featured Event component is editable.

    > Since we haven’t configured the server-side, the event detail pages are expected to error out and the event list won’t be loaded on the Home screen since we haven’t deployed the real Event API.

1. Launch this request in Postman or any REST API client:
http://habitatfitness.dev.local/sitecore/api/layout/render/jss?item=/&sc_lang=en&sc_apikey=<your-api-key-here>

    This is the output of the "real" Layout Service API. Notice the context object is populated along with more meta-data about the route. The shape of the output is very close to what we've seen coming out from the disconnected Layout Service. Notice the data for the `EventList` and `ProductRecommendationList` components - they only have the `title` field there but not the event/product list data. It is by design as that is a job of the Event and Product API which we need to have implemented.

1.	Launch `https://habitatfitness.dev.local` and demonstrate that the app is rendered by the same Sitecore instance, which is able to work as both an API endpoint and an integrated Sitecore instance rendering the application.

1. Notice the events aren’t loading. Open the dev console and see 404s from an non-existing service.
Let’s get that fixed.

## Scene 4. Replacing mocked APIs server-side
Now that the app is bootstrapped, let’s add missing server-side configuration and real API implementation.

Deploy server components from source
Check [this section](https://github.com/Sitecore/Sitecore.HabitatHome.Omni#1-deploy-server-side-components) in main Readme.md for details.

> Use "quick deploy" target to skip deploying items to your Sitecore instance, as at this stage we only need files: `.\build.ps1 -Target Quick-Deploy`

## Scene 5. Continue working connected

Now that the app is deployed to your Sitecore instance, you can continue working by being "connected" to the real API.

### Flow
-	Run `jss start:connected` in command line.
-	Change content in Sitecore – you should see it reflected in your browser after refresh.

## Scene 6. Adding new components in connected
WIP