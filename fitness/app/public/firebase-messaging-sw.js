importScripts("https://www.gstatic.com/firebasejs/5.0.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.0.4/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "%firebaseMessagingSenderId%"
});

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