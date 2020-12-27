const Post = require('../models/post');
const Person = require('../models/person');
const uuid = require('node-uuid');
let { creds } = require("./../config/credentials");
const controller = require('../controllers/person');

let neo4j = require('neo4j-driver');
const _ = require('lodash');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
const util = require('util')
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

//broj likeova, dis, comm

//get za postove od ljudi koje pratim
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

        session.close();
        const Data = _manyPosts(posts)

        // const d = Data.forEach(function (value, i) {
        //     Data[i].likes = controller.findLikes(Data[i].id)
        // });

        res.status(200)
            .json({ message: "Prikupljeno", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.getByPostId = async (req, res) => {
    try {
        let session = driver.session();
        const posts = await session.run('MATCH (post:Post {id: $id}) RETURN post', {
            id: req.params.id
        });

        const Data = _manyPosts(posts)
        const like = await session.run('MATCH (post:Post {id: $id})<-[r:like]-(n:Person) RETURN count(r) as count', {
            id: req.params.id
        })
        const likes = like.records[0].get('count').low
        const d = Data.map(d => d.likes=likes)
        session.close();
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
        let session = driver.session();
        const key = JSON.stringify(Object.assign({}, {user: req.params.id}, {collection: "post"}));

        //da li je u redisu
        const cacheValue = await client.get(key)

        //ako jeste
        if(cacheValue) {
            const Data = JSON.parse(cacheValue)

            return res.status(200).json({message: "Prikupljeno iz redisa", Data})
        }
        //ako nije
        const posts = await session.run('MATCH (n:Person {id: $id})-[r:created]->(post:Post) RETURN post', {
            id: req.params.id
        })
        session.close();
        const Data = _manyPosts(posts)

        client.set(key, JSON.stringify(Data), 'EX', 10)

        res.status(200)
            .json({ message: "Prikupljeno iz neo4j", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

//treba i da se napravi relacija od onog ko je dodao post
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

exports.deletePost = async  (req, res) => {
    let session = driver.session();
    try {
        const rel = await session.run('match (a:Person {id:$personId})-[r:created]->(b:Post {id:$postId}) delete r ', {
            personId: req.body.personId,
            postId: req.body.postId
          })

        p = await session.run('MATCH (post:Post {id: $postId}) DELETE post', {
            postId: req.body.postId});
        res.status(200)
            .json({message: "Obrisan"});
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
}

// exports.findLikes = (id) => {
//     let session = driver.session();
//     try {
//         const l = session.run('MATCH (post:Post {id: $id})<-[r:like]-(n:Person) RETURN count(r) as count'
//         ).records[0].get('count').low

//         return l
//     }
//     catch (err) {
//         console.log(err);
//     }
// }