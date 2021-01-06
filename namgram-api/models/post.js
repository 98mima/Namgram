const _ = require('lodash');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));

const Post = module.exports = function (_node) {
    _.extend(this, {
        'id':  _node.properties['id'],
        'date': _node.properties['date'],
        'content': _node.properties['content'],
        'creator': _node.properties['creator'],
        'likes': _node.properties['likes'],
        'dislikes': _node.properties['dislikes'],
        'comments': _node.properties['comments'],
        'commentsList': _node.properties['commentsList']
    })
  
};



let session = driver.session();

const posts = await session.run('MATCH (post:Post) RETURN post', {
});
const p = _manyPosts(posts)
session.close();

let Data = []
let creators = []

Data = await Promise.all(p.map(post => {
    return findProps(post)
}))

creators = await Promise.all(
    Data.map(post => {
    return post.creator = findCreator(post)
}))
Data.map((post, index) =>
    post.creator = creators[index])

res.status(200)