const fs = require("fs");
const recorder = require("node-record-lpcm16");

class Recoader {
  constructor(filename) {
    this.filename = filename;
  }
  startRecord() {
    const tmpFile = fs.createWriteStream(this.filename, { encoding: "binary" });
    // 録音する
    console.log("recoading...");
    this.recorder = recorder.record();
    this.recorder.stream().pipe(tmpFile);
  }

  stopRecord() {
    // 録音の終了
    this.recorder.stop();
    console.log("done");
  }
}

module.exports.Recoader = Recoader;
