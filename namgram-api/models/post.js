const _ = require('lodash');

const Post = module.exports = function (_node) {
    _.extend(this, {
        'id':  _node.properties['id'],
        'datum': _node.properties['date'],
        'content': _node.properties['content'],
        'likes': _node.properties['likes']
    })
  
};