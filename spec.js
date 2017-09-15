var request = require('supertest');

describe('civinky web service', function () {
  var server;

  beforeEach(function () {
    server = require('./service');
  });

  afterEach(function () {
    server.close();
  });

  it('smoke test', function testSlash(done) {
    request(server)
      .post('/generate')
      .expect(200, done);
  });
});
