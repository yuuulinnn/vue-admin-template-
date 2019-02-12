'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://easymock.ithanhua.cn/mock/5c526ddc5c5e226593eba853/vue-admin"',
})
