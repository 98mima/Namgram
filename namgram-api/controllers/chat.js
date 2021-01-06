const util = require('util')
const redis = require('redis');
const { concat } = require('lodash');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
//client.get = util.promisify(client.get);

var chatters = []
var chat_messages = []
var mess = []

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

exports.getMessages = async (req, res) => {
    try {
        res.json({
            "messages": chat_messages,
            "status": "OK"
        })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}

exports.getActiveChatters = async (req, res) => {
    try {
        res.json({
            "active": chatters,
            "status": "OK"
        })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}

//kad udje u chat sa nekom osobom da:
//-bude aktivan
//-da vidi prethodne poruke
exports.joinChat = async (req, res) => {
    try {
        var username = req.body.username
        if (chatters.indexOf(username) == -1) {
            chatters.push(username)
            client.set('active_users', JSON.stringify(chatters))
            res.json({
                "active": chatters,
                "status": "OK"
            })
        }
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}

//user nije vise aktivan
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
        console.log(users)

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