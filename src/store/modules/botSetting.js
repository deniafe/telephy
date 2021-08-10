import firebase from 'firebase'
import { db } from '@/plugins/firebase'
import notific from '@/utils/notificFunc'

export default {
  namespaced: true,
  state: () => {
    return {
      botSettings: false,
      templateDialog: false,
      pickedTemplate: '',
      templateStatus: false,
      currentRewardIndex: null,
      currentRewardImage: null,
      abcFile: null,
      pushNotificationDialog: false,
      socialAppearancePopUp: false,
      currentSocialImage: null,
      currentNotificationImage: null
    }
  },
  mutations: {
    OPEN_BOT_SETTINGS(state, payload) {
      state.botSettings = payload
    },
    SET_TEMPLATE_DIALOG(state, status) {
      state.templateDialog = status
    },
    SET_PICKED_TEMPLATE(state, template) {
      state.pickedTemplate = template
    },
    SET_TEMPLATE_STATUS(state, status) {
      state.templateStatus = status
    },
    SET_CURRENT_REWARD_INDEX(state, index) {
      state.currentRewardIndex = index
    },
    SET_CURRENT_REWARD_IMAGE(state, file) {
      state.currentRewardImage = file
    },
    SET_CURRENT_REWARD_FILE(state, file) {
      state.abcFile = file
    },
    SET_PUSH_NOTIFICATION_DIALOG(state, status) {
      state.pushNotificationDialog = status
    },
    SET_SOCIAL_APPEARANCE_POPUP(state, status) {
      state.socialAppearancePopUp = status
    },
    SET_CURRENT_SOCIAL_IMAGE(state, file) {
      state.currentSocialImage = file
    },
    SET_CURRENT_NOTIFICATION_IMAGE(state, file) {
      state.currentNotificationImage = file
    }
  },
  actions: {
    setContest({ rootGetters, dispatch }, contest) {
      const bot = rootGetters['bot/currentBot']

      const contestExtract = {
        template: contest.template,
        settings: {
          winnerSelect: contest.winnerSelect,
          pointsForReferralsAndSignUps: contest.pointsForReferralsAndSignUps,
          pointsForSocialInteractions: contest.pointsForSocialInteractions,
          customActions: []
        }
      }

      const botRef = db.collection('bots').doc(bot.id)

      // Set the image field of this user
      return botRef
        .update({
          contest: contestExtract
        })
        .then(function() {
          // Create a success notification
          notific({
            dispatch,
            message: 'Bot template updated successfully',
            type: true
          })
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false
          })
        })
    },
    addReward({ rootGetters, dispatch }, reward) {
      const bot = rootGetters['bot/currentBot']

      const botRef = db.collection('bots').doc(bot.id)

      return botRef
        .update({
          rewards: firebase.firestore.FieldValue.arrayUnion(reward)
        })
        .then(function() {
          // Create a success notification
          notific({
            dispatch,
            message: 'Bot rewards updated successfully',
            type: true
          })
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false
          })
        })
    },
    updateReward({ rootGetters, dispatch }) {
      const bot = rootGetters['bot/currentBot']

      const botRef = db.collection('bots').doc(bot.id)

      return botRef
        .update({
          rewards: bot.rewards
        })
        .then(function() {
          // Create a success notification
          notific({
            dispatch,
            message: 'Bot rewards updated successfully',
            type: true
          })
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false
          })
        })
    },
    setCurrentRewardImage({ commit }, file) {
      commit('SET_CURRENT_REWARD_IMAGE', file)
    },
    setCurrentRewardFile({ commit }, file) {
      commit('SET_CURRENT_REWARD_FILE', file)
    },
    updateCustomAction({ rootGetters, dispatch }) {
      const bot = rootGetters['bot/currentBot']

      const botRef = db.collection('bots').doc(bot.id)

      return botRef
        .update({
          contest: bot.contest
        })
        .then(function() {
          // Create a success notification
          notific({
            dispatch,
            message: 'Bot custom actions updated successfully',
            type: true
          })
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false
          })
        })
    },
    updateSocialAppearance({ rootGetters, dispatch }) {
      const bot = rootGetters['bot/currentBot']

      const botRef = db.collection('bots').doc(bot.id)

      return botRef
        .update({
          socialAppearance: bot.socialAppearance
        })
        .then(function() {
          // Create a success notification
          notific({
            dispatch,
            message: 'Bot social appearance updated successfully',
            type: true
          })
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false
          })
        })
    },
    setCurrentSocialImage({ commit }, file) {
      commit('SET_CURRENT_SOCIAL_IMAGE', file)
    },
    setCurrentNotificationImage({ commit }, file) {
      commit('SET_CURRENT_NOTIFICATION_IMAGE', file)
    }
  },
  getters: {
    botSettings: state => state.botSettings,
    templateDialog: state => state.templateDialog,
    pickedTemplate: state => state.pickedTemplate,
    templateStatus: state => state.templateStatus,
    currentRewardIndex: state => state.currentRewardIndex,
    currentRewardImage: state => state.currentRewardImage,
    currentRewardFile: state => state.abcFile,
    pushNotificationDialog: state => state.pushNotificationDialog,
    socialAppearancePopUp: state => state.socialAppearancePopUp,
    currentSocialImage: state => state.currentSocialImage,
    currentNotificationImage: state => state.currentNotificationImage
  }
}
