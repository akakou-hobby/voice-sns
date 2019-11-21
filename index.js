const fs = require("fs");
const readline = require("readline");

// var firebase = require("firebase/app");
// require("firebase/auth");
// require("firebase/firestore");

const SmartSpearker = require("./smart_spearker").SmartSpearker;
const config = require("./config");

// firebase.initializeApp(config.firebase);

// email = "hoge@example.com";
// password = "hogehoge";

// firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
//   console.log(error.code)
//   console.log(error.message)
// })

// firebase
//   .auth()
//   .signInWithEmailAndPassword(email, password)
//   .catch(error => {
//     console.log(error.code);
//     console.log(error.message);
//   });

// var db = firebase.firestore();

// firebase.auth().onAuthStateChanged(user => {
//   if (user) {
//     const date = new Date();
//     const postId = `${date.getTime()}`;

//     db.collection("users")
//       .doc(user.uid)
//       .collection("posts")
//       .doc(postId)
//       .set({ content: "fuga" });

//     console.log("done");
//   } else {
//   }
// });

judgerRules = [
  {
    words: ["投稿", "とうこう", "登校"],
    callback: () => {
      console.log("投稿");
    }
  },
  {
    words: ["タイムライン"],
    callback: () => {}
  }
];

const smartSpearker = new SmartSpearker(judgerRules);
smartSpearker.run();

// gpioで置き換える
console.log("press enter key...");
