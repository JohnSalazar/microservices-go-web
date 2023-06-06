/* eslint-disable prettier/prettier */
import { createServer } from 'https'
import next from 'next'
import { parse } from 'url'

import { ReloadServiceName } from './src/task/check-service-name-task'
import { Start } from './src/task/secure-http-server-task'
;(async () => {
  process.on('SIGINT', () => {
    console.log('Intercepting SIGINT')
  })

  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.')
  })

  let proceed = false
  let count = 0

  do {
    console.log('consul count: ', count++)
    proceed = await ReloadServiceName()
  } while (!proceed)

  proceed = false
  count = 0
  do {
    console.log('start count: ', count++)
    proceed = await Start()
  } while (!proceed)

  const dev = process.env.NODE_ENV !== 'production'
  const hostname = 'localhost'
  const port = Number(process.env.PORT) || 3000

  const app = next({ dev, hostname, port })
  const handle = app.getRequestHandler()

  const httpsOptions = {
    key: process.env.TLS_KEY,
    cert: process.env.TLS_CERT,
    ca: [process.env.TLS_CA],
  }

  app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
      } catch (err) {
        console.error('error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    })
      .once('error', (err) => {
        console.error(err)
        // process.exit(1)
      })
      .listen(port, () => {
        console.log(`> Ready on https://${hostname}:${port}`)
      })
  })
})()
