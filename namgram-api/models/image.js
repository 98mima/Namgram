const _ = require('lodash');

const Image = module.exports = function (_node) {
    _.extend(this, {
        "id":  _node.properties['id'],
        "user": _node.properties['user'],
        "date": _node.properties['date'],
        "caption": _node.properties['caption'],
        "image_url": _node.properties['image_url']
    })
  //MATCH (U:User{name:'Alice'}) set U.url="<img src="https://placekitten.com/200/300 13" alt="cat image"/>" return U
};