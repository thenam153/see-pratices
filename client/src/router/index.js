import Vue from 'vue'
import VueRouter from 'vue-router'
import State from '../services/state'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: 'Home'
    },
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/app',
    name: 'App',
    meta: {
      title: 'App',
      requireAuth: true
    },
    component: () => import('../components/main-layout/MainLayout.vue')
  }, 
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Login'
    },
    component: () => import('../components/login/Login.vue'),
    beforeEnter(to, from, next) {
      if(State.isLogin) {
        return next({ path: '/app' })
      }
      next()
    }
  }, 
  {
    path: '/user',
    name: 'User',
    meta: {
      title: 'User'
    },
    component: () => import('../views/UserPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL || window.origin,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if(State.isLogin) return next()
  if(to.meta.requireAuth) {
    return next({ path: '/login' })
  }
  next()
})
export default router
