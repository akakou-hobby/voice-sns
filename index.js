const fs = require("fs");
const readline = require("readline");

const SmartSpearker = require("./smart_spearker").SmartSpearker;
const sns = require("./sns");

const config = require("./config");

judgerRules = [
  {
    words: ["ログイン"],
    callback: sns.login
  },
  {
    words: ["投稿"],
    callback: sns.postMessage
  }
];

const smartSpearker = new SmartSpearker(judgerRules);
smartSpearker.run();

console.log("press enter key...");
