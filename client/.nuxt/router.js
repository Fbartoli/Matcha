import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _3199ad02 = () => interopDefault(import('../pages/activate/index.vue' /* webpackChunkName: "pages/activate/index" */))
const _8e80273e = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _3ff19bb3 = () => interopDefault(import('../pages/login/index.vue' /* webpackChunkName: "pages/login/index" */))
const _97a7c5b2 = () => interopDefault(import('../pages/password/index.vue' /* webpackChunkName: "pages/password/index" */))
const _4c23272f = () => interopDefault(import('../pages/register/index.vue' /* webpackChunkName: "pages/register/index" */))
const _15262219 = () => interopDefault(import('../pages/reset/index.vue' /* webpackChunkName: "pages/reset/index" */))
const _273b90e9 = () => interopDefault(import('../pages/welcome.vue' /* webpackChunkName: "pages/welcome" */))
const _06cb6a88 = () => interopDefault(import('../pages/login/logout/index.vue' /* webpackChunkName: "pages/login/logout/index" */))
const _204a5141 = () => interopDefault(import('../pages/login/matchme/index.vue' /* webpackChunkName: "pages/login/matchme/index" */))
const _d839a59a = () => interopDefault(import('../pages/login/mycrush/index.vue' /* webpackChunkName: "pages/login/mycrush/index" */))
const _4fcd5c66 = () => interopDefault(import('../pages/login/profile/index.vue' /* webpackChunkName: "pages/login/profile/index" */))
const _2cd44674 = () => interopDefault(import('../pages/login/mycrush/mylikes/index.vue' /* webpackChunkName: "pages/login/mycrush/mylikes/index" */))
const _ba5c32b4 = () => interopDefault(import('../pages/login/mycrush/myviews/index.vue' /* webpackChunkName: "pages/login/mycrush/myviews/index" */))
const _65891de8 = () => interopDefault(import('../pages/login/mycrush/notifications/index.vue' /* webpackChunkName: "pages/login/mycrush/notifications/index" */))
const _a98c875a = () => interopDefault(import('../pages/login/profile/mygeoloc/index.vue' /* webpackChunkName: "pages/login/profile/mygeoloc/index" */))
const _7bd403ed = () => interopDefault(import('../pages/login/profile/mypics/index.vue' /* webpackChunkName: "pages/login/profile/mypics/index" */))
const _5434837b = () => interopDefault(import('../pages/login/profile/settings/index.vue' /* webpackChunkName: "pages/login/profile/settings/index" */))
const _dbeb88c6 = () => interopDefault(import('../pages/login/profile/settings/newpass/index.vue' /* webpackChunkName: "pages/login/profile/settings/newpass/index" */))
const _57d4a170 = () => interopDefault(import('../pages/login/chat/_username/index.vue' /* webpackChunkName: "pages/login/chat/_username/index" */))
const _40f74263 = () => interopDefault(import('../pages/login/user/_username/index.vue' /* webpackChunkName: "pages/login/user/_username/index" */))
const _54811619 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _11ad00a9 = () => interopDefault(import('../pages/_/index.vue' /* webpackChunkName: "pages/_/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/activate",
    component: _3199ad02,
    name: "activate"
  }, {
    path: "/inspire",
    component: _8e80273e,
    name: "inspire"
  }, {
    path: "/login",
    component: _3ff19bb3,
    name: "login"
  }, {
    path: "/password",
    component: _97a7c5b2,
    name: "password"
  }, {
    path: "/register",
    component: _4c23272f,
    name: "register"
  }, {
    path: "/reset",
    component: _15262219,
    name: "reset"
  }, {
    path: "/welcome",
    component: _273b90e9,
    name: "welcome"
  }, {
    path: "/login/logout",
    component: _06cb6a88,
    name: "login-logout"
  }, {
    path: "/login/matchme",
    component: _204a5141,
    name: "login-matchme"
  }, {
    path: "/login/mycrush",
    component: _d839a59a,
    name: "login-mycrush"
  }, {
    path: "/login/profile",
    component: _4fcd5c66,
    name: "login-profile"
  }, {
    path: "/login/mycrush/mylikes",
    component: _2cd44674,
    name: "login-mycrush-mylikes"
  }, {
    path: "/login/mycrush/myviews",
    component: _ba5c32b4,
    name: "login-mycrush-myviews"
  }, {
    path: "/login/mycrush/notifications",
    component: _65891de8,
    name: "login-mycrush-notifications"
  }, {
    path: "/login/profile/mygeoloc",
    component: _a98c875a,
    name: "login-profile-mygeoloc"
  }, {
    path: "/login/profile/mypics",
    component: _7bd403ed,
    name: "login-profile-mypics"
  }, {
    path: "/login/profile/settings",
    component: _5434837b,
    name: "login-profile-settings"
  }, {
    path: "/login/profile/settings/newpass",
    component: _dbeb88c6,
    name: "login-profile-settings-newpass"
  }, {
    path: "/login/chat/:username?",
    component: _57d4a170,
    name: "login-chat-username"
  }, {
    path: "/login/user/:username?",
    component: _40f74263,
    name: "login-user-username"
  }, {
    path: "/",
    component: _54811619,
    name: "index"
  }, {
    path: "/*",
    component: _11ad00a9,
    name: "all"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
