import { execute } from "./GenericService";
import { firebase } from "@firebase/app";
import "@firebase/messaging";

export async function subscribe(eventId) {
  const token = await getMessagingToken();
  if (token) {
    return executeAction("subscribe", {
      EventId: eventId,
      Token: token
    });
  }

  throw new Error("no noken was resolved")
}

export function unsubscribe(eventId) {
  return executeAction("unsubscribe", { EventId: eventId });
}

function executeAction(eventAction, payload) {
  if (!payload) {
    throw new Error("missing payload");
  }
  return execute(`/subscription/${eventAction}`, payload);
}

const getMessagingToken = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    // TODO: debugging
    console.log({ token });
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const initializeFirebase = callback => {
  try {
    const senderId = process.env.REACT_APP_FIREBASE_SENDER_ID;
    if(!senderId){
      throw new Error("FIREBASE_SENDER_ID is missing. Please add it to environment variables.");
    }

    firebase.initializeApp({ messagingSenderId: senderId});
    const messagingKey = process.env.REACT_APP_FIREBASE_MESSAGING_PUSH_KEY;
    if(!messagingKey){
      throw new Error("FIREBASE_MESSAGING_PUSH_KEY is missing. Please add it to environment variables.");
    }
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(messagingKey);
    messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
      callback(payload);
    });
  } catch (err) {
    console.error("Unable to initialize firebase. " + err);
  }
};
