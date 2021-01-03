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
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const containerName = 'namgram1609522522970';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

function _manyImages(neo4jResult) {
    return neo4jResult.records.map(r => new Image(r.get('image')))
}

exports.getAll = async (req, res) => {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const listBlobsResponse = await containerClient.listBlobFlatSegment();
        for await (const blob of listBlobsResponse.segment.blobItems) {
            console.log(`Blob: ${blob.name}`);
          }

        let session = driver.session();

        const im = await session.run('MATCH (image:Image) RETURN image', {
        });
        const p = _manyImages(im)

        session.close();
        res.status(200)
            .json({ message: "Prikupljeno", p })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
}


