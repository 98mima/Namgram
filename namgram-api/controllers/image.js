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


function findProps(node) {
    try{
        let session = driver.session();

        const query = [
            'MATCH (image:Image {id: $id})<-[r1:like]-(n:Person) with count(r1) as count \
             MATCH (image:Image {id: $id}) RETURN image, count \
             union all \
             MATCH (image:Image {id: $id})<-[r2:dislike]-(n:Person) with count(r2) as count \
             MATCH (image:Image {id: $id}) RETURN image, count \
             union all \
             MATCH (image:Image {id: $id})<-[r3:commented]-(n:Person) with count(r3) as count \
             MATCH (image:Image {id: $id}) RETURN image, count'

        ].join('\n')

        return session.readTransaction(txc =>
            txc.run(query, {
                id: node.id
            }))
            .then( result => {  
            const Data1 = _manyImages(result)
            Data1[0].likes = result.records[0].get('count').low
            Data1[0].dislikes = result.records[1].get('count').low
            Data1[0].comments = result.records[2].get('count').low
            const Data = Data1[0]
            session.close();
    
            return Data})
            .catch(err => {
                console.log(err)
            })
    }
    catch (err){
        console.log(err)
    }
}


function _manyImages(neo4jResult) {
    return neo4jResult.records.map(r => new Image(r.get('image')))
}

exports.getAll = async (req, res) => {
    try {
        let session = driver.session();

        const im = await session.run('MATCH (image:Image) RETURN image', {
        });
        const p = _manyImages(im)

        p.map(image => {
            const containerClient = blobServiceClient.getContainerClient(containerName);
                const blobName = image.blobName
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
              image.sasToken = sasUrl
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

exports.getByPerson = async (req, res) => {
    try {
        let session = driver.session();

        const images = await session.run('MATCH (n:Person {id: $id})-[r:created]->(image:Image) RETURN image', {
            id: req.params.id
        })
        session.close();
        const Data = _manyImages(images)

        Data1 = await Promise.all(Data.map(p => {
            return findProps(p)
        }))

        res.status(200)
            .json({ message: "Prikupljeno iz neo4j", Data1 })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.getByFollowings = async (req, res) => {
    try {
        let session = driver.session();
   
        const images1 = await session.run('match (a:Person {id: $id})-[r:follows]->(b:Person)-[r1:created]->(image:Image) return image', {
            id: req.params.userId
        })
        const images = _manyImages(images1)
        let Data = []
        Data = await Promise.all(images.map(p => {
            return findProps(p)
        }))
        session.close();
        res.status(200)
            .json({ message: "Prikupljeno", Data })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.like = async (req, res) => {
    try {
        let session = driver.session();
        const rel = await session.run('match (a:Person {id:$personId}),(image:Image {id:$imageId}) merge (a)-[r:like]->(image) return r ', {
            personId: req.body.personId,
            imageId: req.body.imageId
        })
        session.close();
        res.status(200)
            .json({ message: "Like", rel })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.dislike = async (req, res) => {
    try {
        let session = driver.session();
        const rel = await session.run('match (a:Person {id:$personId}),(image:Image {id:$imageId}) merge (a)-[r:dislike]->(image) return r ', {
            personId: req.body.personId,
            imageId: req.body.imageId
        })
        session.close();
        res.status(200)
            .json({ message: "Disike", rel })
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};





