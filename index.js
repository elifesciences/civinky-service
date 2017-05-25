/**
 * See README.md for documentation
 */

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

// Load the index.html that we'll use
var indexHtml = fs.readFileSync('node_modules/foundation-emails-template/src/layouts/default.html')
.toString().replace(/{{.*?}}/g, '').trim()

// Load base CSS
var baseCss = sass.renderSync({file: 'node_modules/foundation-emails/scss/foundation-emails.scss'}).css.toString()

// Allow Civinky to be consumed from anywhere (for now)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Validate query params
app.use(function(req, res, next){

  //validate Pug
  if (!('pug' in req.query)) {
    req.query.pug = ''
  }
  pugErrors = validatePug(req.query.pug)
  if(pugErrors){
    res.status(400).send("Errors in Pug:\n" + pugErrors)
  }

  //validate CSS
  if (!('css' in req.query)) {
    req.query.css = ''
  }
  cssErrors = validateCss(req.query.css)
  if(cssErrors.length){
    res.status(400).send("Errors in CSS:\n" + cssErrors.map(e => e.message).join("\n"))
  }

  //validate JSON
  if (!('json' in req.query)) {
    req.query.json = '{}'
  }
  jsonErrors = validateJson(req.query.json)
  if(jsonErrors){
    res.status(400).send("Errors in JSON:\n" + jsonErrors)
  }

  next()
})

app.post('/generate', function (req, res) {

  // Load up the base html template
  let cheerioHtml = cheerio.load(indexHtml.toString())

  // Remove stuff that shouldn't be there
  cheerioHtml('head link[href="css/app.css"]').remove()

  // Add the foundation and submitted CSS
  cheerioHtml('head').append("<style>\n" + baseCss + req.query.css + "\n</style>")

  // Add the submitted html
  submittedHtml = inkyToHtml(pugToInky(req.query.pug, JSON.parse(req.query.json)))
  cheerioHtml('center').prepend(submittedHtml)

  // Inline the CSS and respond with the result
  inlineCss(cheerioHtml.html(), {url:'/', removeStyleTags: false})
  .then(function(html) { res.send(html) })
});

app.listen(process.env.CIVINKY_PORT || 3000)

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
