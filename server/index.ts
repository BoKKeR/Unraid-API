import express from 'express'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'

// Import and Set Nuxt.js options
import config from './nuxt.config'
const app = express()
const isDev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '0.0.0.0',
    port = process.env.PORT || 3000,
  } = nuxt.options.server

  // Build only in dev mode
  if (isDev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  console.log('--------------')
  console.log('--------------')
  console.log('--------------')
  console.log('--------------')
  console.log('--------------')
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}
start()

export default start
