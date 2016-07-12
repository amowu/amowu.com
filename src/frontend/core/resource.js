import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.options.root = process.env.API_URL
Vue.http.interceptors.push({
  response: function (response) {
    if (response.status === 401) {
      // this.logout()
      // this.authenticated = false
      // router.go('/')
    }
    return response
  }
})

export default Vue.http
