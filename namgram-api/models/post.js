const _ = require('lodash');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));

const Post = module.exports = function (_node) {
    _.extend(this, {
        'id':  _node.properties['id'],
        'date': _node.properties['date'],
        'content': _node.properties['content'],
        'likes': _node.properties['likes'],
        'dislikes': _node.properties['dislikes'],
        'comments': _node.properties['comments']
    })
  
};

// module.exports.findLikes =  (id) => {
//     try {
//         let session = driver.session()
//           session.run('MATCH (post:Post {id: $id})<-[r:like]-(n:Person) RETURN count(r) as count', {
//             id: id
//         }).then(function(result) {
//             const likes = result.records[0].get('count').low
//             console.log(likes)
//             return likes
//         })
//         .catch(err => 
//             console.log(err))
//     }
//     catch (err) {
//         console.log(err);
//     }
// }