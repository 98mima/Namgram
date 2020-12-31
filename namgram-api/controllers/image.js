const Image = require('../models/image');
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


function _manyImages(neo4jResult) {
    return neo4jResult.records.map(r => new Image(r.get('image')))
}

exports.add = async  (req, res) => {

    try {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '.' + mm + '.' + yyyy;

        const {name, data} = req.files.pic

        let session = driver.session();
        const query = [
            'CREATE (image:Image {id: $id, date: $date, content: $content, name: $name, data: $data})<-[:created]-(a:Person {id:$personId}) \
             RETURN image'
        ].join('\n')

        const d = await session.writeTransaction(txc =>
            txc.run(query, {
                id: uuid.v4(),
                date: today,
                content: req.body.content,
                personId: req.body.personId,
                name: name,
                data: data
            }))

        const Data1 = _manyImages(d)
        const Data = Data1[0]
        session.close();
        res.status(200)
            .json({ message: "Kreirana slika", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};
