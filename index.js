var firebase = require("firebase/app")

require("firebase/auth")
require("firebase/firestore")
const fs = require('fs')

const config = require("./config")
console.log(config)
firebase.initializeApp(config.firebase)

email = 'hoge@example.com'
password = 'hogehoge'

// firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
//   console.log(error.code)
//   console.log(error.message)
// })

firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
  console.log(error.code)
  console.log(error.message)
})


var db = firebase.firestore();


firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const date = new Date();
    const postId = `${date.getTime()}`

    db.collection('users')
        .doc(user.uid)
        .collection('posts')
        .doc(postId)
        .set({content: 'fuga'})

    console.log('done')

  } else {
  }
});


const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth')


const params = {
    model: 'ja-JP_BroadbandModel',
    audio: fs.createReadStream('sample.ogg'),
    contentType: 'audio/ogg',
};

const speech_to_text = new SpeechToTextV1({
    authenticator: new IamAuthenticator(config.watson.auth)
});

speech_to_text.recognize(params, (error, transcript) => {
    if (error)
        console.log('Error:', error);
    else
        console.log(JSON.stringify(transcript, null, 2));
});
