const { Router } = require('express');
const router = Router();
const { create , eliminate } = require('../controllers/client');
const { verifyToken } = require('../middlewares/verifyToken');


router.post('/create', verifyToken , create );
router.post('/delete/:id', verifyToken , eliminate );



module.exports = router;