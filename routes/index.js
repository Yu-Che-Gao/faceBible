const express = require('express')
const mysql = require('mysql')
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
  res.render('index', { title: title })
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

module.exports = router
