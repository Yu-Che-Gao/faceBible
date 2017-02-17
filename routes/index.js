const express = require('express')
const router = express.Router()
const title = 'FaceBible'

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: title })
})

router.get('/insert', function (req, res, next) {
  res.render('insert', { title: title })
})

module.exports = router
