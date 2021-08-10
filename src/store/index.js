import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user.js'
import action from '@/store/modules/action.js'
import app from '@/store/modules/app.js'
import assetManager from '@/store/modules/assetManager.js'
import auth from '@/store/modules/auth.js'
import bot from '@/store/modules/bot.js'
import botSetting from '@/store/modules/botSetting.js'
import lead from '@/store/modules/lead.js'
import notification from '@/store/modules/notification.js'
import skill from '@/store/modules/skill.js'
import { getRewards } from '@/utils/menu'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [getRewards],
  modules: {
    user, //Include this module
    action,
    app,
    assetManager,
    auth,
    bot,
    botSetting,
    lead,
    notification,
    skill
  },
  state: {},
  mutations: {},
  actions: {}
})
