import { sync } from 'vuex-router-sync'

import store from './core/store'
import router from './core/router'
import App from './vue/pages/App'

sync(store, router)

router.start(App, '#app')
