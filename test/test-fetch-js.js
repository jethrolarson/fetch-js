/* globals describe beforeEach afterEach it */
var expect = require('expect.js')
var fetchJs = require('../index')

describe('fetch-js', function () {
  var serverUrl = '//' + window.location.hostname + ':' + '7788'
  beforeEach(function () {
    window.hello = undefined
  })
  afterEach(function () {
    window.hello = undefined
  })
  it('should execute a script and then trigger the callback', function (done) {
    fetchJs('/base/test/fixtures/win.js').then(function () {
      expect(window.hello).to.eql('hello')
      done()
    }).catch(function () {
      expect(false, 'error should not happen').to.be.ok
      done()
    })
  })
  it('should work cross domain', function (done) {
    fetchJs(serverUrl + '/respond/window.hello="hello"').then(function () {
      expect(window.hello).to.eql('hello')
      done()
    }).catch(function () {
      expect(false, 'error should not happen').to.be.ok
      done()
    })
  })
  it('should remove itself once complete', function (done) {
    fetchJs('/base/test/fixtures/win.js').then(function (el) {
      expect(el.parentElement).to.eql(null)
      done()
    }).catch(function () {
      expect(false, 'error should not happen').to.be.ok
      done()
    })
  })
  it('should work multiple consecutive times with same file', function (done) {
    fetchJs('/base/test/fixtures/win.js').then(function () {
      expect(window.hello).to.eql('hello')
      window.hello = undefined
    }).then(function () {
      return fetchJs('/base/test/fixtures/win.js')
    }).then(function () {
      expect(window.hello).to.eql('hello')
      done()
    }).catch(function () {
      expect(false, 'error should not happen').to.be.ok
      done()
    })
  })
  it('should work multiple consecutive times when file is cached', function (done) {
    fetchJs(serverUrl + '/cache/respond/window.hello="hello"').then(function () {
      expect(window.hello).to.eql('hello')
      window.hello = undefined
    }).then(function () {
      return fetchJs(serverUrl + '/cache/respond/window.hello="hello"')
    }).then(function () {
      expect(window.hello).to.eql('hello')
      done()
    }).catch(function () {
      expect(false, 'error should not happen').to.be.ok
      done()
    })
  })
  it('should error if the script fails to load', function (done) {
    fetchJs('/base/test/fixtures/i-dont-exist.js').then(function () {
      expect(false, 'success should not happen').to.be.ok
      done()
    }).catch(function (err) {
      expect(err).not.to.be(undefined)
      done()
    })
  })
  it('should error if the script responds with a bad status', function (done) {
    fetchJs(serverUrl + '/status/404').then(function () {
      expect(false, 'success should not happen').to.be.ok
      done()
    }).catch(function (err) {
      expect(err).not.to.be(undefined)
      done()
    })
  })
})
