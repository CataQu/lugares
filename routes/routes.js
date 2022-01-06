const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');


router.get('/', controller.browse);
router.get('/read/:id?', controller.read);

router.get('/edit/:id?', controller.edit);
router.put('/edit', controller.put)

router.get('/add', controller.add);
router.post('/', controller.post)

router.delete('/', controller.delete)

module.exports = router