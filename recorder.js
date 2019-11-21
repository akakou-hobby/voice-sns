const config = require("./config");

const fs = require("fs");
const recorder = require("node-record-lpcm16");

class Recoader {
  constructor() {}
  startRecord() {
    const tmpFile = fs.createWriteStream(config.tmpFile, {
      encoding: "binary"
    });
    // 録音する
    this.recorder = recorder.record();
    this.recorder.stream().pipe(tmpFile);
  }

  stopRecord() {
    // 録音の終了
    this.recorder.stop();
  }
}

module.exports.Recoader = Recoader;
