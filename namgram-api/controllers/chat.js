const util = require('util')
const redis = require('redis');
const { concat, isObject } = require('lodash');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
//client.get = util.promisify(client.get);
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

var chatters = []
var chat_messages = []
var mess = []

client.once('ready', function () {
    //flush Redis
    //client.flushdb();
    client.get('chat_users', function (err, reply) {
        if (reply) {
            chatters = JSON.parse(reply)
        }
    })
    client.get('chat_app_messages', function (err, reply) {
        if (reply) {
            chat_messages = JSON.parse(reply)
        }
    })
})

exports.getMessages = async (req, res) => {
    try {
        var username1 = req.params.username1
        var username2 = req.params.username2

        const users = []
        users.push(username1)
        users.push(username2)
        users.sort()

        let Data = []
        const key = JSON.stringify(Object.assign({}, { user1: users[0] }, { user2: users[1] }, { collection: "messages" }));
        client.get(key, function (err, reply) {
            if (reply) {
                Data = JSON.parse(reply)
                return res.status(200).json(Data)
            }
            console.log(err)
        })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}

exports.getActiveChatters = async (req, res) => {
    try {
        const number = chatters.length
        res.json({
            "active": chatters,
            "status": "OK",
            number
        })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}

exports.joinChat = async (req, res) => {
    try {
        var username = req.body.username
        var username2 = req.body.username2
        const users = []
        users.push(username)
        users.push(username2)
        users.sort()

        if (chatters.indexOf(username) == -1) {
            chatters.push(username)
            client.set('active_users', JSON.stringify(chatters))
        }
        let Data = []
        const key = JSON.stringify(Object.assign({}, { user1: users[0] }, { user2: users[1] }, { collection: "messages" }));
        client.get(key, function (err, reply) {
            if (reply) {
                Data = JSON.parse(reply)
                return res.status(200).json({Data, "active": chatters,
                "status": "OK"})
            }
        })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}

exports.leaveChat = async (req, res) => {
    try {
        var username = req.body.username
        chatters.splice(chatters.indexOf(username), 1)
        client.set('active_users', JSON.stringify(chatters))
        res.json({ "status": "OK" })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}

exports.sendMessage = async (req, res) => {
    try {
        var usernameSender = req.body.usernameSender
        var usernameReceiver = req.body.usernameReceiver
        var message = req.body.message

        const users = []
        users.push(usernameReceiver)
        users.push(usernameSender)
        users.sort()

        const key = JSON.stringify(Object.assign({}, { user1: users[0] }, { user2: users[1] }, { collection: "messages" }));
        mess.push({
            "sender": usernameSender,
            "message": message
        })
        console.log(mess)
        client.set(key, JSON.stringify(mess))
        res.json({ "status": "OK" })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}


io.on('connection', function(socket) {
    socket.on('message', function(data) {
        io.emit('send', data)
    });
    socket.io('update_chatter_count', function(data) {
        io.emit('count_chatters', data)
    })
})