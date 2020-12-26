const Post = require('../models/post');
const Person = require('../models/person');
const controller = require('../controllers/post');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
const _ = require('lodash');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);


function _manyPosts(neo4jResult) {
    return neo4jResult.records.map(r => new Post(r.get('post')))
  }

exports.getAll = async (req, res) =>  {
    try{
        let session = driver.session();
        const posts = await session.run('MATCH (post:Post) RETURN post', {
        });
        session.close();
        const Data = _manyPosts(posts)
       res.status(200)
       .json({message: "Prikupljeno", Data})   
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.getByPerson = async (req, res) =>  {
    try{
        //const cachedPosts = client.get()

        let session = driver.session();
        const posts = await session.run('MATCH (n:Person {username: $username})-[r:created]->(post:Post) RETURN post', {
            username: req.params.username
          })
        session.close();
        const Data = _manyPosts(posts)
       res.status(200)
       .json({message: "Prikupljeno", Data})   
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};
