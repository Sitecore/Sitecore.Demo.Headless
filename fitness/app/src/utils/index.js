import { firebase } from "@firebase/app";
import "@firebase/messaging";

export const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const getUrlParams = (search = ``) => {
  if (!search) {
    return {};
  }
  let hashes = search.slice(search.indexOf("?") + 1).split("&");
  let params = {};
  hashes.map(hash => {
    let [key, val] = hash.split("=");
    params[key] = decodeURIComponent(val);
  });

  return params;
};

export const initializeFirebase = callback => {
  try {
    firebase.initializeApp({
      messagingSenderId: "191904745393"
    });

    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(
      "BIlgEONDNQ-29Grj0qPcmPYoNnfpSrtykqdKtq7IqZGoipD0QAzQRCI6KBthtpLbF-qEVUApkZ0hy4U5HAuSbVk"
    );
    messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
      callback(payload);
    });
  } catch (err) {
    console.error("Unable to initialize firebase. " + err);
  }
};

export const promptToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();

    await messaging.requestPermission();
    const token = await messaging.getToken();

    // TODO: save in xDB
    console.log("user token: ", token);

    return token;
  } catch (error) {
    console.error(error);
  }
};

export const getRawFieldValue = (field, defaultValue) => {
  if (!field || !field.value) {
    return defaultValue;
  }
  return field.value;
};
