/* eslint-disable import/no-extraneous-dependencies */
import { firebase } from "@firebase/app";
import "@firebase/messaging";
/* eslint-enable import/no-extraneous-dependencies */
import { boxeverPost,boxeverDelete } from "./GenericService";
import { getGuestRef } from "./BoxeverService";

export async function subscribe(eventId, eventName) {
  //TODO: Not tested yet
  const token = getMessagingToken();
  if (token) {
    getGuestRef().then(response => {
      return boxeverPost(
        "/createguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=SubscribedEvents",
        {
          "key":eventName + " / " + eventId,
          "eventId":eventId
        }
      );
    }).catch(e => {
      console.log(e);
    });
  }
}

export function unsubscribe(eventId, eventName) {
  getGuestRef().then(response => boxeverDelete(
    `/deletekeyforguestdataextension?guestRef=${response.guestRef}&dataExtensionName=SubscribedEvents&key=${eventName} / ${eventId}`
  )).catch(e => {
    console.log(e);
  });
}

const getMessagingToken = async () => {
  try {
    const messaging = firebase.messaging();
    await Notification.requestPermission();
    const token = await messaging.getToken();
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const initializeFirebase = callback => {
  try {
    // HACK: The %something% tokens are replaced just before runtime, way after the Webpack build happened.
    // The final strings can be empty or contain values from the Docker environment variables.
    // To prevent Webpack code optimization to remove the falsy string checks and console.error statements from the browser bundle, we are using the JavaScript (A, B) syntax which always returns the last expression (B) with Math.min() as the first expression to minimize the browser work.
    const firebaseApiKey = (Math.min(), "%firebaseApiKey%");
    if(!firebaseApiKey){
      console.error("REACT_APP_FIREBASE_API_KEY is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/docs/configuration/installation.md");
    }
    const firebaseProjectId = (Math.min(), "%firebaseProjectId%");
    if(!firebaseProjectId){
      console.error("REACT_APP_FIREBASE_PROJECT_ID is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/docs/configuration/installation.md");
    }
    const firebaseMessagingSenderId = (Math.min(), "%firebaseMessagingSenderId%");
    if(!firebaseMessagingSenderId){
      console.error("REACT_APP_FIREBASE_SENDER_ID is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/docs/configuration/installation.md");
    }
    const firebaseAppId = (Math.min(), "%firebaseAppId%");
    if(!firebaseAppId){
      console.error("REACT_APP_FIREBASE_APP_ID is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/docs/configuration/installation.md");
    }

    var firebaseConfig = {
      apiKey: firebaseApiKey,
      projectId: firebaseProjectId,
      messagingSenderId: firebaseMessagingSenderId,
      appId: firebaseAppId
    };
    firebase.initializeApp(firebaseConfig);

    const firebaseMessagingPushKey = (Math.min(), "%firebaseMessagingPushKey%");
    if(!firebaseMessagingPushKey){
      console.error("REACT_APP_FIREBASE_MESSAGING_PUSH_KEY is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/docs/configuration/installation.md");
    }

    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(firebaseMessagingPushKey);
    messaging.onMessage(function(payload) {
      callback(payload);
    });
  } catch (err) {
    console.error("Unable to initialize firebase. " + err);
  }
};
