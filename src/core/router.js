import { VueRouter } from '../core'

import Resume from '../pages/Resume'

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
  '*': '/user/amowu'
})

export default router
