const { Router } = require('express');
const router = Router();
const { create, get, cards, getInfoCard} = require('../controllers/card');

router.post('/create', create);
router.get('/get', get);
router.get('/getInfoCardsClient/:id', getInfoCard);

module.exports = router;