const { Router } = require('express');
const router = Router();
const { create, get } = require('../controllers/card');

router.post('/create', create);
router.get('/get', get);

module.exports = router;