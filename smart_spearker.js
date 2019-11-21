const Recoader = require("./recorder").Recoader;
const config = require("./config");

const fs = require("fs");
const readline = require("readline");

const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const stdin = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const speech_to_text = new SpeechToTextV1({
  authenticator: new IamAuthenticator(config.watson.auth)
});

class SmartSpearker {
  constructor(rules) {
    this.filename = "tmp.wav";
    this.rules = rules;
    this.recorder = new Recoader(this.filename);
    console.log(this.recorder);
  }

  listenSaying(callback) {
    console.log(this.recorder);

    this.recorder.startRecord();

    // gpioで置き換え
    setTimeout(() => {
      this.recorder.stopRecord();

      const watsonParam = {
        model: "ja-JP_BroadbandModel",
        audio: fs.createReadStream(this.filename),
        contentType: "audio/wav"
      };

      console.log("speech apiに送信");
      speech_to_text.recognize(watsonParam, (error, transcript) => {
        if (error) console.log("Error:", error);
        else {
          const msg = transcript.result.results[0].alternatives[0].transcript;
          console.log(msg);
          callback(msg, this);
        }
      });
    }, 2000);
  }

  judge(sentence, self) {
    // スピーチの取得
    for (const rule of self.rules) {
      for (const word of rule.words) {
        if (sentence.indexOf(word) != -1) {
          rule.callback();
          return;
        }
      }
    }
  }

  run() {
    const self = this;

    // gpioで置き換え
    stdin.on("line", line => {
      self.listenSaying(self.judge);
    });
  }
}

module.exports.SmartSpearker = SmartSpearker;
