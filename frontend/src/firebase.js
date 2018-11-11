import firebase from 'firebase';
// import database from 'firebase/app';

// Initialize Firebase
      var config = {
        apiKey: "AIzaSyCDtZK76CwJtPWWVbludQZOERFGR2_3vAA",
        authDomain: "challenge-coach.firebaseapp.com",
        databaseURL: "https://challenge-coach.firebaseio.com",
        projectId: "challenge-coach",
        storageBucket: "challenge-coach.appspot.com",
        messagingSenderId: "792483663704"
      };

    //   debugger
      
      firebase.initializeApp(config);
      var database = firebase.database()
    //   console.log('database', database)
      export default database

      
      // import firebase from 'firebase'; 
      // import database from 'firebase';
      
    //   export function createChallenage(name, coach) {

    //     // var config = {
    //     //     apiKey: "AIzaSyCDtZK76CwJtPWWVbludQZOERFGR2_3vAA",
    //     //     authDomain: "challenge-coach.firebaseapp.com",
    //     //     databaseURL: "https://challenge-coach.firebaseio.com",
    //     //     projectId: "challenge-coach",
    //     //     storageBucket: "challenge-coach.appspot.com",
    //     //     messagingSenderId: "792483663704"
    //     //   };
          
    //     //   debugger
    //     //   firebase.initializeApp(config);

    //       debugger;
    //       firebase.database().ref('challenge/').set({
    //           "name" : "name",
    //           "coach" : "Ru"
    //         })
    //   }