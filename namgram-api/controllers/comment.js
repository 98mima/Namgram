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
client.get = util.promisify(client.get);

function _manyComments(neo4jResult) {
    return neo4jResult.records.map(r => new Comment(r.get('comment')))
}

exports.getByPost = async (req, res) => {
    try{
        let session = driver.session();

        const query = [
            'MATCH (post:Post {id: $id})<-[r1:commented]-(n:Person) return r1 as comment'
        ].join('\n')

        return session.readTransaction(txc =>
            txc.run(query, {
                id: req.params.postId
            }))
            .then( result => {  
            const listOfComments = _manyComments(result)
            
            session.close();
            const Data = listOfComments
    
            res.status(200)
            .json({ Data })})
            .catch(err => {
                console.log(err)
            })
    }
    catch (err){
        res.json({ success: false });
        console.log(err)
    }
}
exports.getByImage = async (req, res) => {
    try{
        let session = driver.session();

        const query = [
            'MATCH (image:Image {id: $id})<-[r1:commented]-(n:Person) return r1 as comment'
        ].join('\n')

        return session.readTransaction(txc =>
            txc.run(query, {
                id: req.params.imageId
            }))
            .then( result => {  
            const listOfComments = _manyComments(result)
            
            session.close();
            const Data = listOfComments
            console.log(req.params.imageId)
    
            res.status(200)
            .json({ Data })})
            .catch(err => {
                console.log(err)
            })
    }
    catch (err){
        res.json({ success: false });
        console.log(err)
    }
}
exports.addToImage = async (req, res) => {
    try {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '.' + mm + '.' + yyyy;

        let session = driver.session();
        const query = [
            'match (p:Image), (a:Person) \
             where p.id = $imageId and a.id = $personId\
             create (p)<-[comment:commented {date:$date, content:$content}]-(a) \
             RETURN comment'
        ].join('\n')

        const com = await session.writeTransaction(txc =>
            txc.run(query, {
                date: today,
                content: req.body.content,
                personId: req.body.personId,
                imageId: req.body.imageId
            }))

        const comment = _manyComments(com)
        const Data = comment[0]

        session.close();
        res.status(200)
            .json({ message: "Kreiran komentar", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};
exports.add = async (req, res) => {
    try {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '.' + mm + '.' + yyyy;

        let session = driver.session();
        const query = [
            'match (p:Post), (a:Person) \
             where p.id = $postId and a.id = $personId\
             create (p)<-[comment:commented {date:$date, content:$content}]-(a) \
             RETURN comment'
        ].join('\n')

        const com = await session.writeTransaction(txc =>
            txc.run(query, {
                date: today,
                content: req.body.content,
                personId: req.body.personId,
                postId: req.body.postId
            }))

        const comment = _manyComments(com)
        const Data = comment[0]

        session.close();
        res.status(200)
            .json({ message: "Kreiran komentar", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

