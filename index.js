var firebase = require("firebase/app")

require("firebase/auth")
require("firebase/firestore")

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


