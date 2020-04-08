const request = require('supertest')
const app = require('../config/app')

describe('Content-Type Middleware', () => {
  test('Should return json content-type as default', async () => {
    app.get('/test_content_type', (req, resp) => {
      resp.send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return html content-type', async () => {
    app.get('/test_content_type_html', (req, resp) => {
      resp.type('html')
      resp.send('')
    })

    await request(app)
      .get('/test_content_type_html')
      .expect('content-type', /html/)
  })
})
