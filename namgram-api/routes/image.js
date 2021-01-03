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
const containerName1 = 'thumbnails';
const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5
//     }
//   });
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const getStream = require('into-stream');
const containerName2 = 'namgram1609522522970';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;

const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);

const getBlobName = originalName => {
    // Use a random number to generate a unique file name, 
    // removing "0." from the start of the string.
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

function _manyImages(neo4jResult) {
    return neo4jResult.records.map(r => new Image(r.get('image')))
}

router.get('/getAll', imageController.getAll)

router.post('/add', uploadStrategy, async (req, res) => {
    try {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '.' + mm + '.' + yyyy;
    
        const content = req.body.caption
        const personId = req.body.personId
        console.log(req.body)
    
        //const { name, data } = req.file.image
        const blobName = await getBlobName(req.file.fieldname);
        const stream = await getStream(req.file.buffer);
        const containerClient = await blobServiceClient.getContainerClient(containerName2);
        const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

        let session = driver.session();
        const query = [
            'CREATE (image:Image {id: $id, date: $date, content: $content, blobName:$blobName})<-[:created]-(a:Person {id:$personId}) \
             RETURN image'
        ].join('\n')

        const d = session.writeTransaction(txc =>
            txc.run(query, {
                id: uuid.v4(),
                date: today,
                content: content,
                personId: personId,
                blobName: blobName
            }))

        const Data1 = _manyImages(d)
        const Data = Data1[0]
        session.close();
        
        await blockBlobClient.uploadStream(stream,
            uploadOptions.bufferSize, uploadOptions.maxBuffers,
            { blobHTTPHeaders: { blobContentType: "image/jpeg" } });

        res.json({ message: 'File uploaded to Azure Blob storage.' });
    } catch (err) {
        res.json({ message: err.message });
    }
});


module.exports = router;