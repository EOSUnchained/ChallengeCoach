// import firebase from 'firebase/app';
import database from './firebase.js'

import $ from 'ajax'
var request = require("request");

// console.log('database', database)

// import firebase from 'firebase'; 
// import database from 'firebase';

export function createChallenage(name, coach) {

    debugger;
    console.log('database', database)
    database.ref('challenge/').set({
              "name" : "name",
              "coach" : "Ru"
      })
      debugger;
}

export function HelloTester() {
    console.log("asdfasd324324")
}


export async function test() {

debugger;
var options = { method: 'PUT',
  url: 'https://challenge-coach.firebaseio.com/players/50cent999345635469.json',
  headers: 
   { 'Postman-Token': '954d4c6a-270b-426b-92fd-34a46bcbfe3e',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: { name: '50cent77777' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

}

export function h() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://challenge-coach.firebaseio.com/players/50cent96657.json",
        "method": "PUT",
        "headers": {
          "Content-Type": "application/json",
          "cache-control": "no-cache",
          "Postman-Token": "ff7a8bd0-23dd-41b4-adad-7530c83ffde0"
        },
        "processData": false,
        "data": "{\n\t\"name\" : \"50cent77777\"\n}"
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
}