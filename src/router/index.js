import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../views/Auth/Auth.vue'
import ResetPassword from '../views/ResetPassword.vue'
import Bot from '../views/Bot.vue'
import EditBot from '../views/EditBot.vue'
import Error from '../views/Error.vue'
import NetworkIssue from '../views/NetworkIssue.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Auth,
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
  },
  {
    path: '/reset-pw',
    name: 'reset-pw',
    component: ResetPassword,
  },
  {
    path: '/bot/:id',
    name: 'bot-id',
    component: Bot,
  },
  {
    path: '/edit-bot/:id',
    name: 'edit-bot-id',
    component: EditBot,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Checkout.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: Error,
    props: true,
  },
  {
    path: '/network-issue',
    name: 'network-issue',
    component: NetworkIssue,
    props: true,
  },
  {
    path: '*',
    redirect: { name: '404', params: { resource: 'page' } },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
