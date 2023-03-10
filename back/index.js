const express = require("express");
const WebSocket = require("ws");
const uuid = require("uuid");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const chalk = require("chalk");
require("dotenv").config();

const itemsRoutes = require('./routes/routes/items');
const chatsRoutes = require("./routes/routes/chats");
const menusRoutes = require("./routes/routes/menus");
const otherRoutes = require("./routes/routes/other");
const regionsRoutes = require("./routes/routes/regions");
const usersRoutes = require("./routes/routes/users");

const app = express();
app.set("port", (process.env.PORT || 3001));
const server = require("http").createServer(app);

const wss = new WebSocket.Server({ server: server });
const webSocketMessage = chalk.bold.bgBlue;



app.use(cors());
app.use(express.json(), express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(itemsRoutes, chatsRoutes, menusRoutes, otherRoutes, regionsRoutes, usersRoutes);

app.use("/api", createProxyMiddleware({
    target: process.env.PROXY,
    changeOrigin: true,
    // secure: false,
    // https: true
}));

const clients = {};

const v4 = uuid.v4;

wss.on("connection", ws => {
    console.log(webSocketMessage("The Client is connected to the WebSocket Server."));
    const id = v4();
    clients[id] = ws;
    console.log(`New Client ${id}`);

    ws.on("message", (data, isBinary) => {
        const { senderId, message } = JSON.parse(data);
        for (const id in clients) {
            clients[id].send(JSON.stringify({ senderId, message, creationDate: new Date().toISOString() }))
        };
        // ws.send(`${data}`);
        // wss.clients.forEach(client => {
        //     if (client !== ws && client.readyState === WebSocket.OPEN) {
        //         client.send(data, {binary: isBinary});
        //     }
        // });
    });

    ws.on("close", () => {
        delete clients[id];
        console.log(`Client is closed ${id}`);
    })
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(res => console.log("The connection to the Database was carried out successfully."))
    .catch(error => console.log(`The Error while connecting to the Database occured: ${error.message}`))

if (process.env.NODE_ENV === "production") {
    app.use(express.static("front/build"));
};

const serverPort = app.get("port");
server.listen(serverPort, error =>
    console.log(error ? `The Error occured: ${error.message}.` : `The Listening Port is ${serverPort}`)
);