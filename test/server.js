const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { pusher } = require("./pusher");


const app = express();

app.use(bodyParser.json());

const router = express.Router();

router.post("/api/messages", async (req, res) => {
  await pusher.trigger("chat", "message", {
    senderId: req.body.senderId,
    message: req.body.message
  });
  res.json([]);
})

app.use(router);
app.use(cors());
app.use(express.json());
app.use("/api", createProxyMiddleware({
  target: "http://localhost:8000",
  changeOrigin: true,
  // secure: false,
  // https: true
}));
app.listen(8000);