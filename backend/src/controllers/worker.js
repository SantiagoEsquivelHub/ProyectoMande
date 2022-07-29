const { response } = require('express');
const { insertWorker, insertWorkforce, getlabors, resulstOfSearch } = require( '../services/worker')


const create = async (req, res = response) => {

    const insertService = await insertWorker(req.body);
    
    if(insertService){
        res.status(200).send("Trabajador creado con exito");
    }else{
        res.status(400).send("Trabajador ya existe");
    }
    
};

const createWorkforce = async (req, res = response) => {

    const insert = await insertWorkforce(req.body);

    if(insert){
        res.status(200).send("Labores creadas con exito");
    }else{
        res.status(400).send("El trabajador ya tiene labores creadas");
    }
    
};

const getAllLabors = async (req , res = response) => {
    const get = await getlabors();

    if(get){
        res.json(get).status(200)
    }else{
        res.status(400).send("No existen labores")
    }
}

const search = async (req, res = response) => {
    const query = await resulstOfSearch(req.body) 
    if(query){
        res.json(query).status(200)
    }else{
        res.status(400).send("No hay resultados para tu busqueda")
    }
}




module.exports = {
    create,
    createWorkforce,
    getAllLabors,
    search
}