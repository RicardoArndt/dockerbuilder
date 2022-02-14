const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, { 
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    } 
});

const jsonParser = bodyParser.json()
const InvalidAppException = require("./lib/exceptions/invalidAppException");

app.use(cors());

const saveAppAsync = require("./lib/saveApp");
app.post("/saveApp", jsonParser, async (req, res) => {
    try {
        const { name, path } = req.body;

        const result = await saveAppAsync(name, path);

        return res.send(result);
    } catch (err) {
        res.type("text/plain");
        res.status(err.status || 500);
        console.error(err);
        return res.send(err.message);
    }
});

const startAppAsync = require("./lib/startApp");
app.post("/startApp", jsonParser, async (req, res) => {
    const { name } = req.body;
    console.log("Init app start");

    try {
        io.emit("message", Buffer.from(`Init app start: ${name}`, "utf8"));

        res.type("text/plain");

        if (!name) {
            throw new InvalidAppException();
        }

        await startAppAsync(name, io);

        res.status(201);
        return res.send(name);
    } catch (err) {
        io.emit("message", Buffer.from(`Error: ${err.message} on start app: ${name}`));
        res.type("text/plain");
        res.status(err.status || 500);

        return res.send(err.message);
    }
});

const getApps = require("./lib/getApps");
app.get("/allApps", async (req, res) => {
    try {
        res.type("application/json");

        const result = await getApps();

        return res.send(result);
    } catch (err) {
        res.type("text/plain");
        res.status(err.status || 500);

        return res.send(err.message);
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

io.on('disconnect', () => {
    console.log('a user disconnected');
});

server.listen(port, () => {
    console.log(`App is started in port: ${port}`);
});
