const { Router } = require('express');
const router = Router();
const { create , eliminate, info } = require('../controllers/client');
const { verifyToken } = require('../middlewares/verifyToken');


router.post('/create' , create );
router.post('/delete/:id', verifyToken , eliminate );
router.get('/info/:id' , info );



module.exports = router;