import Vue from 'vue'
import VueRouter from 'vue-router'

import Resume from '../pages/ResumePage'

Vue.use(VueRouter)

const router = new VueRouter({
  history: true
})

router.map({
  '/': {
    component: Resume
  },
  '/user/:username': {
    component: Resume
  },
  '/idontwannaseeyourresume': {
    component: {
      template: '<div></div>'
    }
  }
})

router.redirect({
  '*': '/'
})

export default router
