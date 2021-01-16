const path = require("path");

const express = require("express");

const personController = require("../controllers/person");

const router = express.Router();

//naci najaktivnijeg usera(koji je najvise lajkovao, omentarisao)

//MATCH (u:User)
// OPTIONAL MATCH (u)-[:AUTHORED|ASKED|COMMENTED]->()
// RETURN u,count(*)
// ORDER BY count(*) DESC
// LIMIT 5
router.get("/all", personController.getAll);
router.get("/byId/:id", personController.get);
router.get("/byEmail/:email", personController.getByEmail);
router.get("/byUsername/:username", personController.getByUsername);
router.get("/getFollowing/:username", personController.getFollowing);
router.get("/getFollowers/:username", personController.getFollowers);
router.get("/getRecommendedPeople/:username", personController.getRecommendedPeople);
router.post("/follow", personController.follow);
router.post("/unfollow", personController.unfollow);
router.delete("/delete", personController.deletePerson);

module.exports = router;
