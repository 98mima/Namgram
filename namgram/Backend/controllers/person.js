//const User = require('../models/person');
//const bcryptjs = require('bcryptjs');
// const { updateUserValidation } = require('../validation')
const controller = require('../controllers/person');
let { creds } = require("./../config/credentials");
let neo4j = require('neo4j-driver');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));


exports.getAll = async (req, res) =>  {
    try{
        let session = driver.session();
        const num_nodes = await session.run('MATCH (n:Person) RETURN n', {
        });
        session.close();
        // console.log("RESULT", (!num_nodes ? 0 : num_nodes.records.length));
        // return (!num_nodes ? 0 : num_nodes.records.length); 
        
        res.status(200)
            .json({message: "Prikupljeno", num_nodes})
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
};

exports.addPerson = async  (req, res) => {
    let session = driver.session();
    let user = "No User Was Created";
    try {
        user = await session.run('MERGE (n:Person {name: $name, lastname: $lastname, username: $username, email: $email, birthday: $birthday, password: $password}) RETURN n', {
            name: req.body.name,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            birthday: req.body.birthday,
            password: req.body.password
        });
        res.status(200)
            .json({message: "Prikupljeno", user});
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
}

exports.deletePerson = async  (req, res) => {
    let session = driver.session();
    try {
        user = await session.run('MATCH (n:Person {username: $id}) DELETE n', {
            id: req.body.username});
        res.status(200)
            .json({message: "Obrisan", user});
    }
    catch (err) {
        res.json({ success: false });
        console.log(err);
    }
}

// exports.getAll = (req, res) => {
//     session
//         .run('MATCH(n:Person) RETURN n LIMIT 25')
//         .then(function(result){
//             result.records.forEach(function(record){
//                 console.log(record)
//             })})
//         .catch(function(err){
//             console.log(err)
//         });
//     res.send("Radi")
// };