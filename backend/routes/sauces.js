const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.get('/', saucesCtrl.getAllSauces);
router.post('/', saucesCtrl.createThing);
router.get('/:id', saucesCtrl.getOneThing);
router.put('/:id', saucesCtrl.modifyThing);
router.delete('/:id', saucesCtrl.deleteThing);

module.exports = router;