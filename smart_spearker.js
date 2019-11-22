const Recoader = require("./recorder").Recoader;
const config = require("./config");

const fs = require("fs");
const readline = require("readline");

const simplayer = require("simplayer");
const Gpio = require("onoff").Gpio;

const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator(config.watson.speechToText)
});

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator(config.watson.textToSpeech)
});

class SmartSpearker {
  constructor(rules) {
    this.rules = rules;
    this.recorder = new Recoader();
  }

  closeEvent() {
    this.button.unexport();
  }

  recordSaying(callback, args) {
    const self = this;
    this.button = new Gpio(14, "in", "both");

    this.button.watch((err, value) => {
      
      if (value) {
      	return
      }
      self.recorder.startRecord();

      // gpioで置き換え
      setTimeout(() => {
        self.recorder.stopRecord();
        callback(self, config.tmpFile, args);
      }, 5000);
    });
  }

  recognizeSaying(self, _, callback) {
    console.log("speech apiに送信");

    const watsonParam = {
      model: "ja-JP_BroadbandModel",
      audio: fs.createReadStream(config.tmpFile),
      contentType: "audio/wav"
    };

    speechToText.recognize(watsonParam, (error, transcript) => {
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

  async say(msg, callback = () => {}) {
    console.log("to speech apiに送信");

    const watsonParam = {
      text: msg,
      voice: "ja-JP_EmiVoice",
      accept: "audio/wav"
    };

    const response = await textToSpeech.synthesize(watsonParam);
    const audio = response.result;
    const repairedFile = await textToSpeech.repairWavHeaderStream(audio);

    fs.writeFileSync("tmp.wav", repairedFile);
    console.log("audio.wav written with a corrected wav header");

    var musicProcess = simplayer("./tmp.wav", error => {
      if (error) console.log(error);

      console.log("sound stop");
      callback(this);
    });
  }

  playSound(data, callback) {
    fs.writeFileSync("tmp.wav", data, error => {
      console.log(error);
    });

    console.log("sound start");
    var musicProcess = simplayer("./tmp.wav", error => {
      if (error) console.log(error);

      console.log("sound stop");
      callback(this);
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

