const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const civinky = require(".")


// Allow Civinky to be consumed from anywhere (for now)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.post('/generate', function (req, res) {

    civinky(req.body).then(function(result){
      res.send(result)
    })
    .catch(function(err){
      res.status(500).send(err.toString());
    })

});
//
app.listen(process.env.CIVINKY_PORT || 30649)
