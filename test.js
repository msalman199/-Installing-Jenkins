const assert = require('assert');
const http = require('http');
const app = require('./app.js');

describe('Application Tests', function() {
  it('should return 200 status code', function(done) {
    http.get('http://localhost:3000', (res) => {
      assert.equal(res.statusCode, 200);
      done();
    });
  });
});
