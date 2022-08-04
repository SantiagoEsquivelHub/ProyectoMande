const { Router } = require('express');
const router = Router();
const { create, getHirings, getHistorial, update, getInfo} = require('../controllers/hiring');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create' , verifyToken , create );
router.post('/update' , verifyToken , update );
router.post('/get' , verifyToken , getHirings );
router.post('/getInfo' , verifyToken , getInfo );
router.post('/historial' , getHistorial);



module.exports = router;