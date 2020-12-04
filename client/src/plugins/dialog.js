
import Vue from 'vue';
import VuejsDialog from 'vuejs-dialog';
// import '../assets/dialog.css';
import 'vuejs-dialog/dist/vuejs-dialog.min.css'

Vue.use(VuejsDialog)

Plugin.install = function(Vue, options) {
    Vue.dialog = VuejsDialog
    window.axios = VuejsDialog
    Object.defineProperties(Vue.prototype, {
        dialog: {
          get() {
            return VuejsDialog;
          }
        },
        $dialog: {
          get() {
            return VuejsDialog;
          }
        },
      });
}
Vue.use(Plugin)

export default Plugin