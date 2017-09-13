
const Inky = require('inky/lib/inky.js');
const i = new Inky();
const Pug = require('pug');
const cheerio = require('cheerio');
const inlineCss = require('inline-css');
const fs = require('fs');

const baseHtml = fs.readFileSync('node_modules/foundation-emails-template/src/layouts/default.html').toString().replace(/{{.*?}}/g, '').trim()
const baseCss = fs.readFileSync('node_modules/foundation-emails/dist/foundation-emails.min.css')


function pugToInky(pug, json){
  return Pug.compile(pug, {pretty: true})(json)
}

function inkyToHtml(inky){
  return i.releaseTheKraken(inky)
}

function wrapWithHtmlAndCss(html, css){
  cheerioHtml = cheerio.load(baseHtml)
  cheerioHtml('head link[href="css/app.css"]').remove()
  cheerioHtml('center').prepend(html)
  cheerioHtml('head').append("<style>\n" + css + "\n</style>")
  return cheerioHtml.html()
}

function prependCss(html, css){
  return "<style>\n" + css + "\n</style>" + html
}


/**
 * transform accepts the following params:
 * params.pug: pug for the template
 * params.css: css to add
 * params.json: a json object for the pug
 * params.snippet: boolean
 * and returns html
 */

function transform(params){
  if(!params.pug) throw('Error: Please include some pug')
  inky = pugToInky(params.pug, params.json)
  html = inkyToHtml(inky)
  css = baseCss + params.css
  if(!params.snippet){
    html = wrapWithHtmlAndCss(html, css)
  }else{
    html = prependCss(html, css)
  }
  return inlineCss(html, {url:'/', removeStyleTags: params.snippet})
}

module.exports = transform
