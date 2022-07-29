const { Router } = require('express');
const router = Router();
const { create } = require('../controllers/hiring');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create' , verifyToken , create );



module.exports = router;