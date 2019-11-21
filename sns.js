const config = require("./config");

const fs = require("fs");

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

firebase.initializeApp(config.firebase);

const db = firebase.firestore();

var uid = null;

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    uid = user.uid;
  } else {
  }
});

const login = IO => {
  firebase
    .auth()
    .signInAnonymously()
    .catch(error => {
      console.log(error.code);
      console.log(error.message);
    });

  console.log(IO);
  IO.say("ログインしました");
};

const postMessage = IO => {
  if (!uid) IO.say("ログインしてください");

  const date = new Date();
  const postId = `${date.getTime()}`;

  console.log("録音を開始します。");
  console.log("ボタンを押してください。");

  IO.closeEvent();

  IO.recordSaying((_, fileName) => {
    const sound = fs.readFileSync(fileName, "base64");

    db.collection("users")
      .doc(uid)
      .collection("posts")
      .doc(postId)
      .set({ content: sound });

    IO.say("投稿しました");

    IO.closeEvent();

    IO.restart();
  });
};

// const acquirePosts = IO => {};
module.exports = {
  login: login,
  postMessage: postMessage
};
