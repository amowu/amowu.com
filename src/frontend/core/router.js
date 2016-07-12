import Vue from 'vue'
import VueRouter from 'vue-router'

import Resume from '../pages/ResumePage'
import ProtectedDemoPage from '../pages/ProtectedDemoPage'

Vue.use(VueRouter)

const router = new VueRouter({
  history: true
})

router.map({
  '/': {
    // component: Resume
    component: {
      template: '<div></div>'
    }
  },
  '/user/:username': {
    component: Resume
  },
  '/idontwannaseeyourresume': {
    component: {
      template: '<div></div>'
    }
  },
  '/protected': {
    component: ProtectedDemoPage
  }
})

router.redirect({
  '*': '/'
})

export default router
