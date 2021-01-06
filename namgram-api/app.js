const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const redis = require('redis');
const app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http)
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

let client = redis.createClient();
client.on('connect', function () {
    console.log('Konektovano sa Redis')
})


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

const port = 8080;
app.listen(port, function () {
    console.log('Server radi na portu ' + port)
})

module.exports = app;

