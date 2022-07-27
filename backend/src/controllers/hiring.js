const { response } = require('express');
const { insertHiring} = require( '../services/hiring')


const create = async (req, res = response) => {

    const insert = await insertHiring(req.body);
    
    if(insert){
        res.status(200).send("Contratación creada con exito");
    }else{
        res.status(400).send("No se pudo crear la contratación");
    }
    
};






module.exports = {
    create
}