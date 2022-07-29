const { Router } = require('express');
const router = Router();
const { create , createWorkforce , getAllLabors } = require('../controllers/worker');

router.post('/create' , create );
router.post('/createWorkforce' , createWorkforce );
router.get('/labors' , getAllLabors );



module.exports = router;