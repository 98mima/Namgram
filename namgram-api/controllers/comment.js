const Comment = require('../models/comment');
const Person = require('../models/person');
const uuid = require('node-uuid');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
const _ = require('lodash');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
const util = require('util')
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

function _manyComments(neo4jResult) {
    return neo4jResult.records.map(r => new Comment(r.get('comment')))
}
function _manyPeople(neo4jResult) {
    return neo4jResult.records.map(r => new Person(r.get('person')))
}
async function findCreator(postId, commId) {
    try {
        let session = driver.session();
        const query = [
            'MATCH (post:Post {id: $id})<-[r1:commented {commId:$commId}]-(person:Person) return person'
        ].join('\n')

        return session.readTransaction(txc =>
            txc.run(query, {
                id: postId,
                commId: commId
            }))
            .then(result => {
                const user = _manyPeople(result)
                session.close();
                return user[0]
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (err) {
        console.log(err)
    }
}
async function findCreatorForImageComm(postId, commId) {
    try {
        let session = driver.session();

        const query = [
            'MATCH (image:Image {id: $id})<-[r1:commented {commId:$commId}]-(person:Person) return person'
        ].join('\n')

        return session.readTransaction(txc =>
            txc.run(query, {
                id: postId,
                commId: commId
            }))
            .then(result => {
                const user = _manyPeople(result)
                session.close();
                console.log(user[0])
                return user[0]
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (err) {
        console.log(err)
    }
}

exports.getByPost = async (req, res) => {
    try {
        let session = driver.session();

        const comments = await session.run('MATCH (post:Post {id: $id})<-[r1:commented]-(n:Person) return r1 as comment', {
            id: req.params.postId
        });
        const p = _manyComments(comments)
        session.close();

        let creators = []
        creators = await Promise.all(
            p.map(post => {
                return post.creator = findCreator(req.params.postId, post.commId)
            }))
        p.map((post, index) =>
            post.creator = creators[index])

        res.status(200)
            .json({ message: "Prikupljeno", p })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}
exports.getByImage = async (req, res) => {
    try {
        let session = driver.session();

        const comments = await session.run('MATCH (image:Image {id: $id})<-[r1:commented]-(n:Person) return r1 as comment ORDER BY r1.date', {
            id: req.params.imageId
        });
        const p = _manyComments(comments)
        console.log(p)
        session.close();

        let creators = []
        creators = await Promise.all(
            p.map(post => {
                return post.creator = findCreatorForImageComm(req.params.imageId, post.commId)
            }))
        p.map((post, index) =>
            post.creator = creators[index])

        res.status(200)
            .json({ message: "Prikupljeno", p })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err)
    }
}
exports.addToPost = async (req, res) => {
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
             create (p)<-[comment:commented {commId:$commId, date:$date, content:$content}]-(a) \
             RETURN comment'
        ].join('\n')

        const com = await session.writeTransaction(txc =>
            txc.run(query, {
                commId: uuid.v4(),
                date: today,
                content: req.body.content,
                personId: req.body.personId,
                postId: req.body.postId
            }))

        const comment = _manyComments(com)
        const Data = comment[0]
        Data.postId = req.body.postId
        Data.creator = req.body.personId

        session.close();
        res.status(200)
            .json({ message: "Kreiran komentar", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};
exports.addToImage = async (req, res) => {
    try {
        var now = new Date();
        // var dd = String(today.getDate()).padStart(2, '0');
        // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        // var yyyy = today.getFullYear();
        // today = dd + '.' + mm + '.' + yyyy;

        let session = driver.session();
        const query = [
            'match (p:Image), (a:Person) \
             where p.id = $imageId and a.id = $personId\
             create (p)<-[comment:commented {commId:$commId, date:$date, content:$content}]-(a) \
             RETURN comment'
        ].join('\n')

        const com = await session.writeTransaction(txc =>
            txc.run(query, {
                commId: uuid.v4(),
                date: now.toUTCString(),
                content: req.body.content,
                personId: req.body.personId,
                imageId: req.body.imageId
            }))

        const comment = _manyComments(com)
        const Data = comment[0]
        Data.postId = req.body.imageId
        Data.creator = req.body.personId

        session.close();
        res.status(200)
            .json({ message: "Kreiran komentar", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};
exports.deleteFromImage = async (req, res) => {
    let session = driver.session();
    try {
      comm = await session.run("MATCH (p:Person)-[r:commented {id:$id}]->(image:Image) DETACH DELETE r", {
        id: req.params.id,
      });
      res.status(200).json({ message: "Obrisan"});
    } catch (err) {
      res.json({ success: false });
      console.log(err);
    }
  };
  exports.deleteFromPost = async (req, res) => {
    let session = driver.session();
    try {
      comm = await session.run("MATCH (p:Person)-[r:commented {id:$id}]->(post:Post) DETACH DELETE r", {
        id: req.params.id,
      });
      res.status(200).json({ message: "Obrisan"});
    } catch (err) {
      res.json({ success: false });
      console.log(err);
    }
  };
