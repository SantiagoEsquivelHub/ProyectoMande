const { Router } = require('express');
const router = Router();
const { create , createWorkforce , getAllLabors , search } = require('../controllers/worker');

router.post('/create' , create );
router.post('/createWorkforce' , createWorkforce );
router.get('/labors' , getAllLabors );
router.post('/search' , search );


module.exports = router;