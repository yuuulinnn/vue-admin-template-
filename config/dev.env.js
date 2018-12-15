'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.0.115:7300/mock/5c0b6365b148110a80c32edb/vue-admin"',
})
