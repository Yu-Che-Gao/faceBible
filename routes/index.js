const express = require('express')
const request = require('request')
const csv = require('csvtojson')
const nl2br = require('nl2br')
const mongoose = require('mongoose')
const router = express.Router()
const title = 'FaceBible'
const conn = mongoose.connect(process.env.MONGODB_URI)

let logSchema = new mongoose.Schema(
  {
    start: { type: String },
    end: { type: String },
    content: { type: String },
    date: { type: Date },
    user: { type: String }
  }
)

router.get('/', (req, res) => {
  let log = mongoose.model('log', logSchema)
  log.find({}, (err, logs) => res.render('index', { title: title, data: logs }))
})

router.get('/insert', (req, res) => {
  res.render('insert', { title: title })
})

router.post('/log/insert', (req, res) => {
  let log = mongoose.model('log', logSchema)
  let instance = new log({
    start: req.body.start,
    end: req.body.end,
    content: req.body.content,
    date: req.body.date,
    user: req.body.user
  })

  instance.save((err, doc) => {
    if (err) {
      res.send('error')
      console.log(err)
    }
    else res.send('success')
  })
})

router.post('/google/image2text', (req, res) => {
  let sendData = {
    "requests":
    [
      {
        "image": { "content": req.body.image },
        "features": [{ "type": "TEXT_DETECTION", "maxResults": 1 }]
      }
    ]
  }

  request({
    method: 'POST',
    uri: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAqIOd_2UJD_ErCWnhYgbza3REslJTdDN8',
    json: sendData
  }, (error, response, body) => {
    res.send(body)
  })
})

router.post('/bible/listall', (req, res) => {
  request('https://bible.fhl.net/json/listall.html', (error, response, csvStr) => {
    if (!error && response.statusCode === 200) {
      let data = []
      let cnum = new Array(50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22);
      csv({ headers: ['index', 'enSimple', 'en', 'ChSimple', 'Ch', 'enShort'], noheader: true })
        .fromString(csvStr)
        .on('json', (jsonObj, index) => {
          jsonObj.cnum = cnum[index]
          data.push(jsonObj)
        })
        .on('done', () => res.json(data))
    }
  })
})

router.post('/bible/content', (req, res) => {
  request('https://bible.fhl.net/json/qb.php?chineses=' + encodeURIComponent(req.body.name) + '&chap=' + req.body.chap, (error, response, body) => {
    if (!error && response.statusCode === 200) res.send(body)
  })
})

module.exports = router
