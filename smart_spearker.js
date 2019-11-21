const Recoader = require("./recorder").Recoader;
const config = require("./config");

const fs = require("fs");
const readline = require("readline");

const simplayer = require("simplayer");

const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const speech_to_text = new SpeechToTextV1({
  authenticator: new IamAuthenticator(config.watson.auth)
});

class SmartSpearker {
  constructor(rules) {
    this.rules = rules;
    this.recorder = new Recoader();
    console.log(this.recorder);
  }

  closeEvent() {
    this.stdin.close();
  }

  recordSaying(callback, args) {
    this.stdin = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    const self = this;

    this.stdin.on("line", line => {
      self.say("recording ...");
      self.recorder.startRecord();

      // gpioで置き換え
      setTimeout(() => {
        self.say("stop recording");

        self.recorder.stopRecord();
        callback(self, config.tmpFile, args);
      }, 2000);
    });
  }

  recognizeSaying(self, _, callback) {
    console.log("speech apiに送信");

    const watsonParam = {
      model: "ja-JP_BroadbandModel",
      audio: fs.createReadStream(config.tmpFile),
      contentType: "audio/wav"
    };

    speech_to_text.recognize(watsonParam, (error, transcript) => {
      if (error) console.log("Error:", error);
      else {
        const unfilteredMsg =
          transcript.result.results[0].alternatives[0].transcript;

        const filteredMsg = unfilteredMsg.replace(/\s+/g, "");

        console.log(filteredMsg);

        callback(self, filteredMsg);
      }
    });
  }

  judge(self, sentence) {
    // スピーチの取得
    for (const rule of self.rules) {
      for (const word of rule.words) {
        if (sentence.indexOf(word) != -1) {
          rule.callback(self);
          return;
        }
      }
    }

    self.say("コマンドが見つかりませんでした");
  }

  say(msg) {
    console.log(msg);
  }

  playSound(data, callback) {
    fs.writeFileSync("tmp.wav", data, error => {
      console.log(error);
    });

    console.log("sound start");
    var musicProcess = simplayer("./tmp.wav", error => {
      if (error) console.log(error);

      console.log("sound stop");
      callback();
    });
  }

  run() {
    this.recordSaying(this.recognizeSaying, this.judge);
  }

  restart() {
    this.run();
  }
}

module.exports.SmartSpearker = SmartSpearker;
