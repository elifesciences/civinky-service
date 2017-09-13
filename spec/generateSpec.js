var request = require("request")
var cheerio = require("cheerio")
var generateUrl = "http://localhost:" + (process.env.CIVINKY_PORT || 30649) + "/generate"

describe('POST request to /generate', function(){

  samplePug = 'p Hello, World!'
  sampleCss = 'p {color: red;}'

  it("with no pug should return a status code 500", function(done) {
    request.post({url: generateUrl, json: {pug: ''}}, function(error, response, body) {
      expect(response.statusCode).toBe(500)
      done()
    })
  })

  it("should turn pug into html", function(done){
    request.post({url: generateUrl, json: {pug: samplePug}}, function(error, response, body) {
      var $ = cheerio.load(body)
      expect($('p').text()).toBe('Hello, World!')
      done()
    })
  })

  it("should inline CSS", function(done){
    request.post({url: generateUrl, json: {pug: samplePug, css: sampleCss}}, function(error, response, body) {
      var $ = cheerio.load(body)
      expect($('p').attr('style')).toContain('color: red;')
      done()
    })
  })

  it("should turn json into html", function(done){
    request.post({url: generateUrl, json: {pug: 'p Hello, #{planet}!', json: {planet: "World"}}}, function(error, response, body) {
      var $ = cheerio.load(body)
      // console.log($.html())
      expect($('p').text()).toBe('Hello, World!')
      done()
    })
  })

  it("should contain '</head>', '</body>' and '</html>' when snippet=false.", function(done) {
    request.post({url: generateUrl, json: { pug: samplePug, snippet: false }}, function(error, response, body) {
      expect(body).toContain('</head>')
      expect(body).toContain('</body>')
      expect(body).toContain('</html>')
      done()
    })
  })

  it("should not contain '</head>', '</body>' or '</html>' when snippet=true.", function(done) {
    request.post({url: generateUrl, json: { pug: samplePug, snippet: true }}, function(error, response, body) {
      expect(body).not.toContain('</head>')
      expect(body).not.toContain('</body>')
      expect(body).not.toContain('</html>')
      done()
    })
  })

})
