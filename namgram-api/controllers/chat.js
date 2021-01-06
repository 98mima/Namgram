const Comment = require('../models/comment');
const uuid = require('node-uuid');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
const _ = require('lodash');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
const util = require('util')
const redis = require('redis');
const { concat } = require('lodash');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
//client.get = util.promisify(client.get);

var chatters = []
var chat_messages = []

client.once('ready', function () {
    //flush Redis
    //client.flushdb();

    //inicijalizacija chattera
    client.get('chat_users', function (err, reply) {
        if (reply) {
            chatters = JSON.parse(reply)
        }
    })

    //inic poruka
    client.get('chat_app_messages', function (err, reply) {
        if (reply) {
            chat_messages = JSON.parse(reply)
        }
    })
})

exports.joinChat = async (req, res) => {
    try {
        var username = req.body.username
        if(chatters.indexOf(username) == -1) {
            chatters.push(username)
            client.set('chat_users', JSON.stringify(chatters))
            res.json({"chatters": chatters,
                    "status": "OK"})
        }
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}