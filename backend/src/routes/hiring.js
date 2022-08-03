const { Router } = require('express');
const router = Router();
const { create, getHirings, getHistorial} = require('../controllers/hiring');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create' , verifyToken , create );
router.post('/get' , verifyToken , getHirings );
router.post('/historial' , getHistorial);



module.exports = router;