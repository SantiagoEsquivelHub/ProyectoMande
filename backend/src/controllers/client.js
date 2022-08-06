const { response } = require('express');
const { insertClient , deleteClient, getInfo } = require( '../services/client')


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
   
    if(deleteService){
        res.status(200).send("Cliente eliminado con exito");
    }else{
        res.status(400).send("Cliente no existe");
    }
    
};

const info = async (req , res = response) => {
    let { id } = req.params;
    const get = await getInfo(id);
    if(get){
        res.json(get).status(200)
    }else{
        res.status(400).send("No existe el cliente")
    }
}

module.exports = {
    create,
    eliminate,
    info
}