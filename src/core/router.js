import { VueRouter } from '../core'

import Resume from '../pages/Resume'

const router = new VueRouter({
  history: true
})

router.map({
  '/': {
    component: Resume
  }
})

export default router
