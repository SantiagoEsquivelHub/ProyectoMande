const { response } = require('express');
const { insertWorker, insertWorkforce, getlabors, resulstOfSearch, getInfo } = require('../services/worker')


const create = async (req, res = response) => {

    try {
        const insertService = await insertWorker(req.body);

        if (insertService) {
            res.status(200).send("Trabajador creado con exito");
        } else {
            res.status(400).send("Trabajador ya existe");
        }
    } catch (error) {
        console.log(error)
    }



};

const createWorkforce = async (req, res = response) => {

    const insert = await insertWorkforce(req.body);

    if (insert) {
        res.status(200).send("Labores creadas con exito");
    } else {
        res.status(400).send("El trabajador ya tiene labores creadas");
    }

};

const getAllLabors = async (req, res = response) => {
    const get = await getlabors();

    if (get) {
        res.json(get).status(200)
    } else {
        res.status(400).send("No existen labores")
    }
}

const search = async (req, res = response) => {
    const query = await resulstOfSearch(req.body)
    if (query) {
        res.json(query).status(200)
    } else {
        res.status(400).send("No hay resultados para tu busqueda")
    }
}

const info = async (req, res = response) => {
    let { id } = req.params;
    const get = await getInfo(id);
    if (get) {
        res.json(get).status(200)
    } else {
        res.status(400).send("No existe el trabajador")
    }
}


module.exports = {
    create,
    createWorkforce,
    getAllLabors,
    search,
    info
}