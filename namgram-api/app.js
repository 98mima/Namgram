const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const redis = require('redis');
const app = express();
var server = require('http').createServer(app)
var realtime = require('./real_time')
// const redisUrl = 'redis://127.0.0.1:6379';
// const client = redis.createClient(redisUrl);

const cors = require('cors');
const neo4j = require('neo4j-driver');
dotenv.config();

const personRoutes = require('./routes/person');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const imageRoutes = require('./routes/image');
const chatRoutes = require('./routes/chat');

let client = redis.createClient();
client.on('connect', function () {
    console.log('Konektovano sa Redis')
})

//realtime(http)

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/person', personRoutes);
app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/image', imageRoutes);
app.use('/chat', chatRoutes);

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

const clientR = redis.createClient(redisUrl);
io.on("connection", (socket) => {
    clientR.SET("socket:" + socket.handshake.query.userId, socket.id);
    //clients[socket.handshake.query.userId] = socket.id;
    // io.to(socket.id).emit("chat", "I just met you");

    // socket.on("like", (userId) => {
    //     console.log(clients[userId])
    //     io.to(clients[userId]).emit("chat", "Stigo lajk batoo")
    // })
});

server.listen(8000, () => {
    console.log("Slusa brat");
})

const port = 8080;
app.listen(port, function () {
    console.log('Server radi na portu ' + port)
})


module.exports = app;

