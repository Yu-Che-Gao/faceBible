const express = require('express')
const mysql = require('mysql')
const request = require('request')
const csv = require('csvtojson')
const nl2br = require('nl2br')
const router = express.Router()
const title = 'FaceBible'

const conn = mysql.createConnection({
  host: 'us-cdbr-azure-southcentral-f.cloudapp.net',
  user: 'be0939441f5394',
  password: '1e3334e2',
  database: 'facebiblesql'
})

conn.connect()

router.get('/', (req, res) => {
  conn.query("SELECT * FROM log", (error, results, fields) => {
    res.render('index', { title: title, data: results })
  })
})

router.get('/insert', (req, res) => {
  res.render('insert', { title: title })
})

router.post('/log/insert', (req, res) => {
  conn.query("INSERT INTO log(`start`, `end`, `content`, `date`) VALUES ('" + req.body.start + "', '" + req.body.end + "', '" + req.body.content + "', '" + req.body.date + "')", (error, results, fields) => {
    if (error) {
      throw error
      res.send('error')
    } else res.send('success')
  })
})

router.post('/google/image2text', (req, res) => {
  let imageData = req.body.image
  let sendData = {
    "requests": [
      {
        "image": { "content": imageData },
        "features": [
          {
            "type": "TEXT_DETECTION",
            "maxResults": 1
          }
        ]
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
