importScripts('https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.1/firebase-messaging.js');

firebase.initializeApp({apiKey: "AIzaSyDgdU-HlBSLDXqrY4QTUEuzrGKqyWmJpi0",
authDomain: "muizzchats.firebaseapp.com",
databaseURL: "https://muizzchats-default-rtdb.firebaseio.com",
projectId: "muizzchats",
storageBucket: "muizzchats.appspot.com",
messagingSenderId: "1064451626421",
appId: "1:1064451626421:web:140ece914119e96f24f5fc",
measurementId: "G-8CP1V0QKF7"}) /*use your own configuration*/

const messaging = firebase.messaging();

var href = self.location.origin 

messaging.onBackgroundMessage(payload => {
	const title = payload.data.title;
	const options = payload.data.image ? {
		badge: "icon.png",
		body: payload.data.body,
		icon: payload.data.photoURL,
        image: payload.data.image,
    } : {
        badge: "icon.png",
        body: payload.data.body,
        icon: payload.data.photoURL,
    }
	self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    self.clients.openWindow(href);
})
