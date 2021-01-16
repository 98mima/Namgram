const Image = require('../models/image');
const uuid = require('node-uuid');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
const _ = require('lodash');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));

const express = require('express');
const imageController = require('../controllers/image');
const router = express.Router();

const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
} = require('@azure/storage-blob');
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const getStream = require('into-stream');
const containerName2 = 'namgram1609522522970';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

function _manyImages(neo4jResult) {
    return neo4jResult.records.map(r => new Image(r.get('image')))
}

router.get('/:id', imageController.get);
router.get('/getAll', imageController.getAll)
router.get('/byId/:id', imageController.getByPerson);
router.get('/byFollowings/:userId', imageController.getByFollowings);
router.get('/mostLikedF/:userId', imageController.getMostLikedF);
router.get('/mostHatedF/:userId', imageController.getMostHatedF);
router.get('/mostCommentedF/:userId', imageController.getMostCommentedF);
router.post('/like', imageController.like);
router.post('/removeLike', imageController.removeLike);
router.post('/dislike', imageController.dislike);
router.post('/removedisLike', imageController.removeDislike);
router.delete('/deleteImage/:imageId', imageController.deleteImage);

router.post('/add', uploadStrategy, async (req, res) => {
    try {
        // var today = new Date();
        // var dd = String(today.getDate()).padStart(2, '0');
        // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        // var yyyy = today.getFullYear();
        // today = dd + '.' + mm + '.' + yyyy;
        const now = new Date();

        const content = req.body.caption
        const personId = req.body.personId

        const blobName = await getBlobName(req.file.fieldname);
        const stream = await getStream(req.file.buffer);
        const containerClient = await blobServiceClient.getContainerClient(containerName2);
        const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

        let session = driver.session();
        const query = [
            'match (a:Person {id:$personId}) \
            merge (a)-[r:created]->(b:Image {id:$id, date:$date, content:$content, blobName:$blobName}) \
            '
        ].join('\n')

        const d = await session.writeTransaction(txc =>
            txc.run(query, {
                id: uuid.v4(),
                date: now.toUTCString(),
                content: content,
                personId: personId,
                blobName: blobName
            }))

        const Data1 = _manyImages(d)
        const Data = Data1[0]
        await blockBlobClient.uploadStream(stream,
            uploadOptions.bufferSize, uploadOptions.maxBuffers,
            { blobHTTPHeaders: { blobContentType: "image/jpeg" } });

        session.close();
        res.json({ message: 'File uploaded to Azure Blob storage.', Data });
    } catch (err) {
        res.json({ message: err.message });
    }
});
router.post('/addProfilePic', uploadStrategy, async (req, res) => {
    try {
        const personId = req.body.personId

        const blobName = await getBlobName(req.file.fieldname);
        const stream = await getStream(req.file.buffer);
        const containerClient = await blobServiceClient.getContainerClient(containerName2);
        const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

        let session = driver.session();
        const query = [
            
            'create (b:Image {id:$id, person:$personId, blobName:$blobName})'
        ].join('\n')

        const d = await session.writeTransaction(txc =>
            txc.run(query, {
                id: uuid.v4(),
                personId: personId,
                blobName: blobName
            }))

        const Data1 = _manyImages(d)
        const Data = Data1[0]
        await blockBlobClient.uploadStream(stream,
            uploadOptions.bufferSize, uploadOptions.maxBuffers,
            { blobHTTPHeaders: { blobContentType: "image/jpeg" } });

        session.close();
        res.json({ message: 'File uploaded to Azure Blob storage.', Data });
    } catch (err) {
        res.json({ message: err.message });
    }
});


module.exports = router;