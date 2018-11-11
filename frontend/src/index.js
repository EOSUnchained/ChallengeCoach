import React from 'react';
// import firebase from 'firebase';
import ReactDOM from 'react-dom';
import Index from './pages/index';
// import firebase from 'firebase';

ReactDOM.render(<Index />, document.getElementById('root'));

// var config = {
//   apiKey: "AIzaSyCDtZK76CwJtPWWVbludQZOERFGR2_3vAA",
//   authDomain: "challenge-coach.firebaseapp.com",
//   databaseURL: "https://challenge-coach.firebaseio.com",
//   projectId: "challenge-coach",
//   storageBucket: "challenge-coach.appspot.com",
//   messagingSenderId: "792483663704"
// };

// firebase.initializeApp(config);

// function writeUserData(userId, name, email, imageUrl) {
//     firebase.database().ref('player/' + userId).set({
//       username: name,
//       email: email,
//       profile_picture : imageUrl
//     });
//   }

//   writeUserData(1, 'bob', 'bob@email', 'url')