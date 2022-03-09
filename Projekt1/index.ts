const express = require('express')
const app = express()
app.get('/:operation/:num1/:num2', function (req, res)
{ 
    res.send(req.querry.operation)
 })
 app.listen(3000)