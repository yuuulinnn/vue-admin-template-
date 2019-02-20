import Vue from 'vue'
import 'font-awesome/scss/font-awesome.scss' //font-awesome
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import CKEditor from '@ckeditor/ckeditor5-vue'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import '@/styles/notosanskr-light/notosanskr.css' // font-notosanskr

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control


Vue.use(ElementUI, { locale })
Vue.use(CKEditor)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
