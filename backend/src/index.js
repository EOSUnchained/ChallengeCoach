import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import demux from './services/demux'
import posts from './routes/posts'
import io from './utils/io'

let app = express()

app.use(cors())

app.use('/posts', posts())

const server = app.listen(process.env.PORT, () => console.info(`Example app listening on port ${process.env.PORT}!`))

io.connect(server)

demux.watch() //polling blockchain with ear to ground looking for defined actions in updater?

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/test').push({original: original}).then((snapshot) => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      return res.redirect(303, snapshot.ref.toString());
    });
  });