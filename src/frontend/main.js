import { sync } from 'vuex-router-sync'

import router from './vue/router'
import store from './vuex/store'
import App from './vue/views/App'

sync(store, router)

router.start(App, 'app')
