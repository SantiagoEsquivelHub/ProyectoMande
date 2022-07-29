const { Router } = require('express');
const router = Router();
const { create , createWorkforce } = require('../controllers/worker');

router.post('/create' , create );
router.post('/createWorkforce' , createWorkforce );



module.exports = router;