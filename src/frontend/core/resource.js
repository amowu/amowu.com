import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.options.root = process.env.API_URL

export default Vue.http
