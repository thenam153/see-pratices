import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import'./plugins/dialog'

import * as Dialog from './dialogs'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import ToggleButton from 'vue-js-toggle-button'
import { Chrome } from 'vue-color'

 
Vue.use(ToggleButton)
Vue.component('VueSlider', VueSlider)
Vue.component('chrome-picker', Chrome)
Vue.dialog.registerComponent('Confirm', Dialog.confirm)
Vue.dialog.registerComponent('ExportProject', Dialog.exportProject)
Vue.dialog.registerComponent('OpenCollection', Dialog.openCollection)
Vue.dialog.registerComponent('Rename', Dialog.rename)
Vue.dialog.registerComponent('SelectProject', Dialog.selectProject)

// import VuejsDialog from 'vuejs-dialog';
// import 'vuejs-dialog/dist /vuejs-dialog.min.css';

// Vue.use(VuejsDialog)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
