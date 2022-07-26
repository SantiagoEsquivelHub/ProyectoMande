const { response } = require('express');
const { insertClient , deleteClient } = require( '../services/client')


const create = async (req, res = response) => {

    const insertService = await insertClient(req.body);
    
    if(insertService){
        res.status(200).send("Cliente creado con exito");
    }else{
        res.status(400).send("Cliente ya existe");
    }
    
};

const eliminate = async (req, res = response) => {
    
    const deleteService = await deleteClient(req.params);
    console.log(deleteService)
    if(deleteService){
        res.status(200).send("Cliente eliminado con exito");
    }else{
        res.status(400).send("Cliente no existe");
    }
    
};



module.exports = {
    create,
    eliminate
}