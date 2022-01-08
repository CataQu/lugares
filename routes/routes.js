const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const controller = require(path.resolve(__dirname, '../controller/controller.js'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/img'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + path.extname(file.originalname)
      cb(null, uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/', controller.browse);
router.get('/read/:id?', controller.read);

router.get('/edit/:id?', controller.edit);
router.put('/edit/:id?', upload.single('img'), controller.put)

router.get('/add', controller.add);
router.post('/add', upload.single('img'), controller.post)

router.delete('/read/:id', controller.delete)

module.exports = router