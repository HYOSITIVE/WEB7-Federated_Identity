// Last Modification : 2021.03.16
// by HYOSITIVE
// based on WEB3 - Express - 3.1

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})