const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const proprio = require('../middleware/proprio');

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneThing);
router.post('/', auth, multer, saucesCtrl.createThing);
router.put('/:id', auth, proprio, multer, saucesCtrl.modifyThing);
router.delete('/:id', auth, proprio, saucesCtrl.deleteThing);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;