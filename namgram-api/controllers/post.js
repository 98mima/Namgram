const Post = require('../models/post');
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

//add comment 

//redis za getove

function _manyPosts(neo4jResult) {
    return neo4jResult.records.map(r => new Post(r.get('post')))
}
function _manyComments(neo4jResult) {
    return neo4jResult.records.map(r => new Comment(r.get('comments')))
}

function findProps(node) {
    try{
        let session = driver.session();

        const query = [
            'MATCH (post:Post {id: $id})<-[r1:like]-(n:Person) with count(r1) as count \
             MATCH (post:Post {id: $id}) RETURN post, count \
             union all \
             MATCH (post:Post {id: $id})<-[r2:dislike]-(n:Person) with count(r2) as count \
             MATCH (post:Post {id: $id}) RETURN post, count \
             union all \
             MATCH (post:Post {id: $id})<-[r3:commented]-(n:Person) with count(r3) as count \
             MATCH (post:Post {id: $id}) RETURN post, count'

        ].join('\n')

        return session.readTransaction(txc =>
            txc.run(query, {
                id: node.id
            }))
            .then( result => {  
            const Data1 = _manyPosts(result)
            Data1[0].likes = result.records[0].get('count').low
            Data1[0].dislikes = result.records[1].get('count').low
            Data1[0].comments = result.records[2].get('count').low
            const Data = Data1[0]
            session.close();
    
            return Data})
            .catch(err => {
                console.log(err)
            })
    }
    catch (err){
        console.log(err)
    }
}

function findComments(node) {
    try{
        let session = driver.session();

        const query = [
            'MATCH (post:Post {id: $id})<-[r1:commented]-(n:Person) return r1 as comments'
        ].join('\n')

        return session.readTransaction(txc =>
            txc.run(query, {
                id: node.id
            }))
            .then( result => {  
            const listOfComments = _manyComments(result)
            
            session.close();
            console.log(listOfComments)
    
            return listOfComments})
            .catch(err => {
                console.log(err)
            })
    }
    catch (err){
        console.log(err)
    }
}

//ovde ne mogu da se prikazu komentari, vec samo njihov broj
//tako da kad se klikne na broj komentara onda treba da izadju komentari za taj post
exports.getAll = async (req, res) => {
    try {
        let session = driver.session();

        const posts = await session.run('MATCH (post:Post) RETURN post', {
        });
        const p = _manyPosts(posts)

        let Data = []
        Data = await Promise.all(p.map(post => {
            return findProps(post)
        }))

        // kk = Data
        // let Data1 = []
        // Data1 = await Promise.all(kk.map(d => {
        //      d.commentsList = findComments(d)
        // }))

        session.close();
        res.status(200)
            .json({ message: "Prikupljeno", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.getByFollowings = async (req, res) => {
    try {
        let session = driver.session();
   
        const posts1 = await session.run('match (a:Person {id: $id})-[r:follows]->(b:Person)-[r1:created]->(post:Post) return post', {
            id: req.params.userId
        })
        const posts = _manyPosts(posts1)
        let Data = []
        Data = await Promise.all(posts.map(p => {
            return findProps(p)
        }))
        session.close();
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

        const post1 = await session.run('MATCH (post:Post {id: $id}) RETURN post', {
            id: req.params.id
        })
        const post2 = _manyPosts(post1)[0]
        post = await findProps(post2)

        post.commentsList = await findComments(post)
        Data = post

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
        const key = JSON.stringify(Object.assign({}, { user: req.params.id }, { collection: "post" }));
        //da li je u redisu
        const cacheValue = await client.get(key)

        //ako jeste
        if (cacheValue) {
            const Data = JSON.parse(cacheValue)

            return res.status(200).json({ message: "Prikupljeno iz redisa", Data })
        }
        //ako nije
        const posts = await session.run('MATCH (n:Person {id: $id})-[r:created]->(post:Post) RETURN post', {
            id: req.params.id
        })
        session.close();
        const Data = _manyPosts(posts)

        client.set(key, JSON.stringify(Data));
        client.expire(key, 10);

        res.status(200)
            .json({ message: "Prikupljeno iz neo4j", Data })
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

exports.deletePost = async (req, res) => {
    let session = driver.session();
    try {
        const rel = await session.run('match (a:Person {id:$personId})-[r:created]->(b:Post {id:$postId}) delete r ', {
            personId: req.body.personId,
            postId: req.body.postId
        })

        p = await session.run('MATCH (post:Post {id: $postId}) DELETE post', {
            postId: req.body.postId
        });
        res.status(200)
            .json({ message: "Obrisan" });
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
}
