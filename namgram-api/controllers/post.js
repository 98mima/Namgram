const Post = require('../models/post');
const Person = require('../models/person');
const uuid = require('node-uuid');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
const _ = require('lodash');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

//broj likeova, dis, comm

//get za postove od ljudi koje pratim
//delete post
//add comment 

//redis za getove
function _manyPosts(neo4jResult) {
    return neo4jResult.records.map(r => new Post(r.get('post')))
}

exports.getAll = async (req, res) => {
    try {
        let session = driver.session();
        const posts = await session.run('MATCH (post:Post) RETURN post', {
        });

        const query = await session.run('MATCH (post:Post) RETURN post', {
        });



        session.close();
        const Data = _manyPosts(posts)
        res.status(200)
            .json({ message: "Prikupljeno", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.getByPerson = async (req, res) => {
    try {
        //const cachedPosts = client.get()

        let session = driver.session();
        const posts = await session.run('MATCH (n:Person {username: $username})-[r:created]->(post:Post) RETURN post', {
            username: req.params.username
        })
        session.close();
        const Data = _manyPosts(posts)
        res.status(200)
            .json({ message: "Prikupljeno", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.createPost = async (req, res) => {
    try {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '.' + mm + '.' + yyyy;

        let session = driver.session();
        const p = await session.run('CREATE (post:Post {id: $id, date: $date, content: $content}) RETURN post', {
            id: uuid.v4(),
            date: today,
            content: req.body.content
        })
        session.close();
        res.status(200)
            .json({ message: "Kreiran post", p })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.like = async (req, res) => {
    try {
        let session = driver.session();
        const rel = await session.run('match (a:Person {id:$personId}),(post:Post {id:$postId}) merge (a)-[r:like]->(post) return r ', {
            personId: req.body.personId,
            postId: req.body.postId
        })
        session.close();
        res.status(200)
            .json({ message: "Like postavljen", rel })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.dislike = async (req, res) => {
    try {
        let session = driver.session();
        const rel = await session.run('match (a:Person {id:$personId}),(post:Post {id:$postId}) merge (a)-[r:dislike]->(post) return r ', {
            personId: req.body.personId,
            postId: req.body.postId
        })
        session.close();
        res.status(200)
            .json({ message: "Disike postavljen", rel })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};