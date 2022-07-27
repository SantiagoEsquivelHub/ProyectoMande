const { response } = require('express');
const { insertWorker } = require( '../services/worker')


const create = async (req, res = response) => {

    const insertService = await insertWorker(req.body);
    
    if(insertService){
        res.status(200).send("Trabajador creado con exito");
    }else{
        res.status(400).send("Trabajador ya existe");
    }
    
};




module.exports = {
    create
}