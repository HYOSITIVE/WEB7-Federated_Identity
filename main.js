// Last Modification : 2021.04.03
// by HYOSITIVE
// based on WEB3 - Express - 3.2

var express = require('express')
var app = express()
const port = 3000

// route, routing : path에 따라 적당한 응답
// app.get('/', (req, res) => {res.send('Hello World!')})
app.get('/', function(req, res) {
	return res.send('/')
});

app.get('/page', function(req, res) {
	return res.send('/page')
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));