const { response } = require('express');
const { hireWorker, viewHiring, getHiringFinished, finishHireWorker, getInfoToPay} = require( '../services/hiring')


const create = async (req, res = response) => {

    const insert = await hireWorker(req.body);
    
    if(insert){
        res.status(200).send("Contratación creada con exito");
    }else{
        res.status(400).send("No se pudo crear la contratación");
    }
    
};

const update = async (req, res = response) => {

    const insert = await finishHireWorker(req.body);
    
    if(insert){
        res.status(200).send("Contratación actualizada con exito");
    }else{
        res.status(400).send("No se pudo actualizar la contratacion");
    }
    
};

const getHirings = async (req, res = response) => {
    const query = await viewHiring(req.body) 

    if(query != ''){
        res.json(query).status(200)
    }else{
        res.status(400).send("No hay ninguna contratación")
    }
}

const getInfo = async (req, res = response) => {
    const query = await getInfoToPay(req.body) 
    if(query != ''){
        res.json(query).status(200)
    }else{
        res.status(400).send("No hay información")
    }
}


const getHistorial = async (req, res = response) => {
    const query = await getHiringFinished(req.body) 
    if(query != ''){
        res.json(query).status(200)
    }else{
        res.status(400).send("No hay ninguna contratación")
    }
}




module.exports = {
    create,
    getHirings,
    getHistorial,
    update,
    getInfo
}