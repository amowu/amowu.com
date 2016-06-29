import { sync } from 'vuex-router-sync'

import router from './core/router'
import App from './vue/views/App'
import store from './vuex/store'

sync(store, router)

router.start(App, '#app')
