'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
	//BASE_API: '"https://easy-mock.com/mock/5b8cbf045ae7a7318a6651ee/transino"',
	// BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
	BASE_API: '"http://127.0.0.1/api.php"',
	
})
