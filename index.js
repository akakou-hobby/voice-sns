const fs = require("fs");
const readline = require("readline");

const recorder = require("node-record-lpcm16");

// var firebase = require("firebase/app");
// require("firebase/auth");
// require("firebase/firestore");

const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const config = require("./config");

const stdin = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

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

const speech_to_text = new SpeechToTextV1({
  authenticator: new IamAuthenticator(config.watson.auth)
});

stdin.on("line", function(line) {
  const tmpFile = fs.createWriteStream("tmp.wav", { encoding: "binary" });

  recorder.record({
    sampleRate: 44100
  });

  // 録音する
  console.log("recoading...");
  const recording = recorder.record();
  recording.stream().pipe(tmpFile);

  setTimeout(() => {
    // 録音の終了
    recording.stop();
    console.log("done");

    const watsonParam = {
      model: "ja-JP_BroadbandModel",
      audio: fs.createReadStream("tmp.wav"),
      contentType: "audio/wav"
    };

    // スピーチの取得
    speech_to_text.recognize(watsonParam, (error, transcript) => {
      if (error) console.log("Error:", error);
      else {
        console.log(JSON.stringify(transcript, null, 2));
        console.log(transcript.result.results[0].alternatives[0].transcript);
      }
    });
    // gpioで置き換える
    console.log("press enter key...");
  }, 5000);
});

// gpioで置き換える
console.log("press enter key...");
