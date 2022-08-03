const { Router } = require('express');
const router = Router();
const { create, get, cards } = require('../controllers/card');

router.post('/create', create);
router.get('/get', get);
router.get('/getCardsClient/:id', cards);

module.exports = router;