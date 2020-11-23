const express = require("express");
const router = express.Router();
const md5 = require("md5");
const axios = require("axios");

//C'est ma home page qui affiche tous les personnages (100 par page) :
//   --   Nous avons besoin d'envoyer page et le numero de page :
router.get("/characters", async (req, res) => {
  console.log("acces route characters");

    const marvel_api_private_key = process.env.PRIVATE_KEY
    const apikey = process.env.PUBLIC_KEY

    const page = req.query.page;
    try {
      const offset = Number(page*100-100);
      const date = new Date();
      const ts = date.getTime() / 1000;

      const hash = md5(ts + marvel_api_private_key + apikey);

      //https://gateway.marvel.com:443/v1/public/characters?
      const response = await axios.get(`https://gateway.marvel.com:443/v1/public/characters?limit=100&ts=${ts}&apikey=${apikey}&hash=${hash}&offset=${offset}`);
      res.json(response.data);

    } catch (error) {
      console.log(error.message);
      res.status(400).json(error.response);
    }
  });

  //Page comics par personnage : affiches les comics en lien avec un personnage choisi
router.get("/character/:id", async (req, res) => {
  const id = Number(req.params.id);

    const date = new Date();
    const ts = date.getTime() / 1000;

    const hash = md5(ts + marvel_api_private_key + apikey);

  try {
    const response = await axios.get(`https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${ts}&apikey=${apikey}&hash=${hash}`)
    console.log(response.data);
    res.status(200).json(response.data)
  } catch (error) {
    console.log(error.response)
    res.status(400).json(error.message)
  }
})


//C'est ma route charactere qui affiche un seul personnage et ses infos (notamment les comics dans lesques il se trouve). Je trouve ce perso en mettant son id dans les params.
// GET /v1/public/characters/{characterId}/comics   Parameter Type : path                 Data type : int
router.get("/character/1011766", async (req, res) => {

  const date = new Date();
  const ts = date.getTime() / 1000;

  const hash = md5(ts + marvel_api_private_key + apikey);

  const character_id = 1011766;

const response = await axios.get(`https://gateway.marvel.com:443/v1/public/characters/${character_id}?ts=${ts}&apikey=${apikey}&hash=${hash}`)
res.json(response.data)
})



  module.exports = router;
