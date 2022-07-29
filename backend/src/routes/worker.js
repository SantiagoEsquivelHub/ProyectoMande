const { Router } = require('express');
const router = Router();
const { create , createWorkforce , getAllLabors , search, info } = require('../controllers/worker');

router.post('/create' , create );
router.post('/createWorkforce' , createWorkforce );
router.get('/labors' , getAllLabors );
router.post('/search' , search );
router.get('/info/:id' , info );

module.exports = router;