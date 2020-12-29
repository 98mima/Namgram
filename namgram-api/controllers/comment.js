const Post = require('../models/post');
const Person = require('../models/person');
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
client.get = util.promisify(client.get);

exports.add = async (req, res) => {
    try {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '.' + mm + '.' + yyyy;

        let session = driver.session();
        const query = [
            'CREATE (post:Post {id: $id, date: $date, content: $content})<-[:created]-(a:Person {id:$personId}) \
             RETURN post'
        ].join('\n')

        const d = await session.writeTransaction(txc =>
            txc.run(query, {
                id: uuid.v4(),
                date: today,
                content: req.body.content,
                personId: req.body.personId
            }))

        const Data1 = _manyPosts(d)
        const Data = Data1[0]
        session.close();
        res.status(200)
            .json({ message: "Kreiran post", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};