#! /usr/bin/env node
require('dotenv').config()

const server = require('../lib/server')

server.start(3000)
