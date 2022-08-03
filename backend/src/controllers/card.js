const { response } = require('express');
const { insertCard, getCardTypes, getCardsClient } = require('../services/card')


const create = async (req, res = response) => {

    const insertService = await insertCard(req.body);

    if (insertService) {
        res.status(200).send("Tarjeta creada con exito");
    } else {
        res.status(400).send("Tarjeta ya existe");
    }

};

const get = async (req , res = response) => {
    const get = await getCardTypes();
    if(get){
        res.json(get).status(200)
    }else{
        res.status(400).send("No existen tipos de tarjetas")
    }
}

const cards = async (req , res = response) => {
    let { id } = req.params;
    const get = await getCardsClient(id);
    if(get){
        res.json(get).status(200)
    }else{
        res.status(400).send("Este cliente no tiene tarjetas")
    }
}

module.exports = {
    create,
    get,
    cards
}