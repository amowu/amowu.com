import { sync } from 'vuex-router-sync'

import router from './core/router'
import store from './core/store'
import App from './App'

sync(store, router)

router.start(App, 'app')
