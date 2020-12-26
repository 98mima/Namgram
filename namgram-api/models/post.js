const _ = require('lodash');

const Post = module.exports = function (_node) {
    _.extend(this, {
        "id":  _node.properties['id'],
        "date": _node.properties['date'],
        "content": _node.properties['content']
    })
  
};