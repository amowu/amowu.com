import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.options.root = process.env.API_URL
Vue.http.interceptors.push((request, next) => {
  next(response => {
    if (response.status === 401) {
      // TODO:
      // this.logout()
      // this.authenticated = false
      // router.go('/')
    }
  })
})

export default Vue.http
