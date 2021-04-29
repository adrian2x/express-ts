require('dotenv').config()
require('make-promises-safe') // installs an 'unhandledRejection' handler

const { start } = require('./server')

start()
