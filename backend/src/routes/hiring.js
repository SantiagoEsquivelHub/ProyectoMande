const { Router } = require('express');
const router = Router();
const { create , getHirings} = require('../controllers/hiring');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create' , verifyToken , create );
router.get('/get' , verifyToken , getHirings );



module.exports = router;