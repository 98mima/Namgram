const Image = require('../models/image');
const uuid = require('node-uuid');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
const _ = require('lodash');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
const { concat } = require('lodash');
const multer = require('multer');
var storage = require("@azure/storage-blob")
const accountname ="namgram";
const key = "b9/PjmImjnORF1berLyRe3OYyAO0dDGcTbqIYm5AkCm8tqYukKm/umiUPWLJujc2n+zPFwKbKKNFZAZm8kqWhA==";
const cerds = new storage.StorageSharedKeyCredential(accountname,key);
const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
} = require('@azure/storage-blob');
const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = newPipeline(sharedKeyCredential);
const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);
const containerName = 'namgram1609522522970';
const client =blobServiceClient.getContainerClient(containerName)



function _manyImages(neo4jResult) {
    return neo4jResult.records.map(r => new Image(r.get('image')))
}

exports.getAll = async (req, res) => {
    try {
        let session = driver.session();

        const im = await session.run('MATCH (image:Image) RETURN image', {
        });
        const p = _manyImages(im)

        const Data = [];
        p.map(post => {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            //const listBlobsResponse = await containerClient.listBlobFlatSegment();
            //for await (const blob of listBlobsResponse.segment.blobItems) {
                const blobName = post.blobName
                //const blobName="32451306818267955-image";
                const blobClient = client.getBlobClient(blobName);
                const blobSAS = storage.generateBlobSASQueryParameters({
                    containerName, 
                    blobName: blobName, 
                    permissions: storage.BlobSASPermissions.parse("racwd"), 
                    startsOn: new Date(),
                    expiresOn: new Date(new Date().valueOf() + 86400)
                  },
                  cerds 
                ).toString();
              
                  const sasUrl= blobClient.url+"?"+blobSAS;         
              post.sasToken = sasUrl
              
        })


        session.close();
        res.status(200)
            .json({ message: "Prikupljeno", p })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
}


