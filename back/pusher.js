const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1556089",
  key: "aa5fa40f514180632721",
  secret: "3accd5130c1c2da1ce3f",
  cluster: "eu",
  useTLS: true
});

module.exports = { pusher }