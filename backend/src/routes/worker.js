const { Router } = require('express');
const router = Router();
const { create } = require('../controllers/worker');

router.post('/create' , create );


module.exports = router;