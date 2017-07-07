var Promise = require('bluebird')
var express = require('express')
var app = express()
var csslint = require('csslint').CSSLint;
var jsonlint = require('jsonlint')
var puglint = require('pug-lint')
var pug = require('pug')
var Inky = require('inky').Inky
var i = new Inky({})
var cheerio = require('cheerio')
var inlineCss = require('inline-css')
var fs = require("fs")
var sass = require("node-sass")
var bodyParser = require('body-parser');

// Load the index.html that we'll use
var indexHtml = fs.readFileSync('node_modules/foundation-emails-template/src/layouts/default.html').toString().replace(/{{.*?}}/g, '').trim()

// Load base CSS
var baseCss = sass.renderSync({file: 'node_modules/foundation-emails/scss/foundation-emails.scss'}).css.toString()

// Allow Civinky to be consumed from anywhere (for now)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

// Validate query params
app.use(function(req, res, next){

  //validate Pug
  if (!('pug' in req.body)) {
    req.body.pug = ''
  }
  pugErrors = validatePug(req.body.pug)
  if(pugErrors){
    res.status(400).send("Errors in Pug:\n" + pugErrors)
  }

  //validate CSS
  if (!('css' in req.body)) {
    req.body.css = ''
  }
  cssErrors = validateCss(req.body.css)
  if(cssErrors.length){
    res.status(400).send("Errors in CSS:\n" + cssErrors.map(e => e.message).join("\n"))
  }

  //validate JSON
  if (!('json' in req.body)) {
    req.body.json = '{}'
  }
  jsonErrors = validateJson(req.body.json)
  if(jsonErrors){
    res.status(400).send("Errors in JSON:\n" + jsonErrors)
  }

  next()
})


app.post('/generate', function (req, res) {

  submittedHtml = inkyToHtml(pugToInky(req.body.pug, JSON.parse(req.body.json)))


  // snippet mode
  if(req.body.snippet === true){
    // Add the foundation and submitted CSS and HTML
    cheerioHtml = cheerio.load("<style>\n" + baseCss + req.body.css + "\n</style>" + submittedHtml)
    // Inline the CSS and respond with the result
    inlineCss(cheerioHtml.html(), {url:'/', removeStyleTags: true})
    .then(function(html) { res.send(html) })

  // full mode
  }else{
    // Load up the base html template
    cheerioHtml = cheerio.load(indexHtml.toString())
    // Remove stuff that shouldn't be there
    cheerioHtml('head link[href="css/app.css"]').remove()
    // Add the foundation and submitted CSS
    cheerioHtml('head').append("<style>\n" + baseCss + req.body.css + "\n</style>")
    cheerioHtml('center').prepend(submittedHtml)
    // Inline the CSS and respond with the result
    inlineCss(cheerioHtml.html(), {url:'/', removeStyleTags: false})
    .then(function(html) { res.send(html) })
  }

});
//
app.listen(process.env.CIVINKY_PORT || 30649)

// Converting from Pug to Inky flavoured html (i.e. still has inky tags in at this stage)
function pugToInky(source, data){
  compiled = pug.compile(source, {pretty: true})
  return compiled(data)
}

// Replace Inky tags with html tags
function inkyToHtml(inky){
  cheerioHtml = cheerio.load(inky)
  return i.releaseTheKraken(cheerioHtml)
}

// Validate CSS
function validateCss(css){
  result = csslint.verify(css);
  return result.messages.filter(m => m.type == 'error')
}

// Validate Pug
function validatePug(source){
  try{
    compiled = pug.compile(source)
  }catch (e){
    return e
  }
  return false
}

// Validate JSON
function validateJson(json){
  try{
    result = jsonlint.parse(json);
  }catch (e){
    return e
  }
  return false
}
