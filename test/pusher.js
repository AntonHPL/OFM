const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1556089",
  key: "aa5fa40f514180632721",
  secret: "3accd5130c1c2da1ce3f",
  cluster: "eu",
  useTLS: true
});

module.exports = { pusher }

// export function handler1(req, res) {
//   const { socket_id, channel_name, username } = req.body;
//   const randomString = Math.random().toString(36).slice(2).length;
//   const presenceData = {
//     user_id: randomString,
//     user_info: {
//       username,
//     }
//   }

//   try {
//     const auth = pusher.authenticate(socket_id, channel_name, presenceData)
//   } catch (error) {
//     console.log(error)
//   }
// }

// export async function handler2(req, res) {
//   const { message, username } = req.body;
//   await pusher.trigger("presence-channel", "chat-update", {
//     message, username
//   })
//   res.json({ status: 200 });
// }