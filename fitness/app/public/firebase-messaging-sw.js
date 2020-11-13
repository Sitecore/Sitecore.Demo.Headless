importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js");

const firebaseApiKey = "%firebaseApiKey%";
if(!firebaseApiKey){
  console.error("REACT_APP_FIREBASE_API_KEY is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Omni/blob/master/docs/configuration/installation.md");
}
const firebaseProjectId = "%firebaseProjectId%";
if(!firebaseProjectId){
  console.error("REACT_APP_FIREBASE_PROJECT_ID is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Omni/blob/master/docs/configuration/installation.md");
}
const firebaseMessagingSenderId = "%firebaseMessagingSenderId%";
if(!firebaseMessagingSenderId){
  console.error("REACT_APP_FIREBASE_SENDER_ID is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Omni/blob/master/docs/configuration/installation.md");
}
const firebaseAppId = "%firebaseAppId%";
if(!firebaseAppId){
  console.error("REACT_APP_FIREBASE_APP_ID is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Omni/blob/master/docs/configuration/installation.md");
}

var firebaseConfig = {
  apiKey: firebaseApiKey,
  projectId: firebaseProjectId,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log({ payload });
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body."
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});