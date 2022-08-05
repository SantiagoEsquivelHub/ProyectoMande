const { response } = require('express');
const { insertCard, getCardTypes, getCardsClient, getInfoOfCardClient } = require('../services/card')


const create = async (req, res = response) => {

    const insertService = await insertCard(req.body);

    if (insertService) {
        res.status(200).send("Tarjeta creada con exito");
    } else {
        res.status(400).send("Tarjeta ya existe");
    }

};

const get = async (req , res = response) => {
    const get = await getCardTypes(); //Consultar??
    if(get){
        res.json(get).status(200)
    }else{
        res.status(400).send("No existen tipos de tarjetas")
    }
}

const getInfoCard = async (req , res = response) => {
    const get = await getInfoOfCardClient(req.params.id);
    if(get){
        res.json(get).status(200)
    }else{
        res.status(400).send("No existe informacion del cliente")
    }
}


module.exports = {
    create,
    get,
    getInfoCard
}