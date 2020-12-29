const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

const redis = require('redis');
// const redisUrl = 'redis://127.0.0.1:6379';
// const client = redis.createClient(redisUrl);

const cors = require('cors');
const neo4j = require('neo4j-driver');
dotenv.config();

const personRoutes = require('./routes/person');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

let client = redis.createClient();
client.on('connect', function(){
    console.log('Konektovano sa Redis')
})


const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'neo4j'));
// var session = driver.session();

//app.get('/dummy', (req, res) => res.send('Response from Route of the Express Server!!'))

// const instance = Neode.fromEnv();

app.use('/person', personRoutes);
app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);

const port = 8080;
app.listen(port, function(){
    console.log('Server radi na portu ' +port)
})

module.exports = app;