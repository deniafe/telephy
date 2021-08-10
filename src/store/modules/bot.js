import firebase from 'firebase'
import { db } from '@/plugins/firebase'
import { skill } from '@/utils/skill'
import notific from '@/utils/notificFunc'
import router from '@/router/index.js'

export default {
  namespaced: true,
  state: () => {
    return {
      currentBot: '',
      currentBotId: '',
      bots: [],
      loading: false,
      dialog: false,
      creating: false,
      filter: 'all'
    }
  },
  mutations: {
    SET_CURRENT_BOT(state, bot) {
      state.currentBot = bot
    },
    SET_CURRENT_BOT_ID(state, id) {
      state.currentBotId = id
    },
    SET_BOTS(state, bots) {
      state.bots = bots
    },
    SET_BOT_LOADING(state, status) {
      state.loading = status
    },
    SET_CREATING(state, status) {
      state.creating = status
    },
    SET_BOT_DIALOG(state, val) {
      state.dialog = val
    },
    SET_FILTERED_BOTS(state, status) {
      state.filter = status
    },
    EDIT_REWARD(state, { index, reward }) {
      state.currentBot.rewards.splice(index, 1, reward)
    },
    DELETE_REWARD(state, index) {
      const rewards = state.currentBot.rewards
      rewards.splice(index, 1)
    },
    ADD_CUSTOM_ACTION(state, action) {
      state.currentBot.contest.settings.customActions.push(action)
    },
    EDIT_CUSTOM_ACTION(state, { index, action }) {
      const actions = state.currentBot.contest.settings.customActions
      actions.splice(index, 1, action)
    },
    DELETE_CUSTOM_ACTION(state, index) {
      const actions = state.currentBot.contest.settings.customActions
      actions.splice(index, 1)
    },
    ADD_SOCIAL_NETWORK(state, network) {
      const networks = state.currentBot.socialAppearance
      for (let i = 0; i < networks.length; i++) {
        if (i === network.index) {
          networks[i].title = network.title
          networks[i].status = true
          networks[i].image = network.image
          networks[i].content = network.content
        }
      }
    },
    REMOVE_SOCIAL_NETWORK(state, index) {
      const networks = state.currentBot.socialAppearance
      for (let i = 0; i < networks.length; i++) {
        if (i === index) {
          networks[i].title = ''
          networks[i].status = false
          networks[i].image = ''
          networks[i].content = ''
        }
      }
    },
    EDIT_NOTIFICATION_CONTENT(state, { content, index, subIndex }) {
      const messages = state.currentBot.eventsAndNotifications
      for (let i = 0; i < messages.length; i++) {
        if (i === index) {
          const notifications = messages[i].notifications
          notifications.splice(subIndex, 1, content)
        }
      }
    },
    DELETE_NOTIFICATION_CONTENT(state, { index, subIndex }) {
      const messages = state.currentBot.eventsAndNotifications
      for (let i = 0; i < messages.length; i++) {
        if (i === index) {
          const notifications = messages[i].notifications
          notifications.splice(subIndex, 1)
        }
      }
    },
    ADD_NOTIFICATION_CONTENT(state, { content, image, index }) {
      const messages = state.currentBot.eventsAndNotifications
      for (let i = 0; i < messages.length; i++) {
        if (i === index) {
          const schedule = messages[i].notifications[0].schedule
          const frequency = messages[i].notifications[0].frequency
          if (schedule) {
            messages[i].notifications.splice(0, 1, {
              content,
              image,
              schedule
            })
          } else if (frequency) {
            messages[i].notifications.splice(0, 1, {
              content,
              image,
              frequency
            })
          }

          return
        }
      }
    },
    SET_PUSH_NOTIFICATION_STATUS(state, { val, index }) {
      const messages = state.currentBot.eventsAndNotifications
      for (let i = 0; i < messages.length; i++) {
        if (i === index) {
          messages[i].status = val
          return
        }
      }
    },
    SET_PUSH_NOTIFICATION_FREQUENCY(state, { frequency, index }) {
      const messages = state.currentBot.eventsAndNotifications
      for (let i = 0; i < messages.length; i++) {
        if (i === index) {
          // store the previous conte t and image so you can replace entirely
          const content = messages[i].notifications[0].content
          const image = messages[i].notifications[0].image
          if (messages[i].notifications[0].frequency) {
            messages[i].notifications.splice(0, 1, {
              content,
              image,
              frequency
            })
            return
          }
        }
      }
    },
    SET_PUSH_NOTIFICATION_SCHEDULE(state, { schedule, index }) {
      const messages = state.currentBot.eventsAndNotifications
      for (let i = 0; i < messages.length; i++) {
        if (i === index) {
          // store the previous conte t and image so you can replace entirely
          const content = messages[i].notifications[0].content
          const image = messages[i].notifications[0].image
          if (messages[i].notifications[0].schedule) {
            messages[i].notifications.splice(0, 1, {
              content,
              image,
              schedule
            })
            return
          }
        }
      }
    }
  },
  actions: {
    setCurrentBot({ commit, getters }, { id }) {
      const bots = getters.bots
      let currentBot

      for (let i = 0; i < bots.length; i++) {
        if (id === bots[i].id) {
          currentBot = bots[i]
          commit('SET_CURRENT_BOT', currentBot)
          return
        }
      }
    },
    getBots({ commit, rootGetters, dispatch }) {
      commit('SET_BOT_LOADING', true)
      const userId = rootGetters['auth/user'].id

      const bots = []

      const botRef = db.collection('bots').where('userId', '==', userId)

      botRef.onSnapshot(
        snapshot => {
          const changes = snapshot.docChanges()
          let data
          changes.forEach(change => {
            if (change.type === 'added') {
              data = change.doc.data()
              const addedBots = {
                id: change.doc.id,
                title: data.title,
                key: data.key,
                rewards: data.rewards,
                contest: data.contest,
                status: data.status,
                leadCount: data.leadCount,
                leadWithRefsCount: data.leadWithRefsCount,
                referralsCount: data.referralsCount,
                socialAppearance: data.socialAppearance,
                eventsAndNotifications: data.eventsAndNotifications,
                startDate: data.startDate.toDate().toDateString(),
                endDate: data.endDate.toDate().toDateString()
              }

              bots.push(addedBots)
            } else if (change.type === 'modified') {
              data = change.doc.data()
              const editedBot = {
                id: change.doc.id,
                title: data.title,
                key: data.key,
                rewards: data.rewards,
                contest: data.contest,
                status: data.status,
                socialAppearance: data.socialAppearance,
                eventsAndNotifications: data.eventsAndNotifications,
                startDate: data.startDate.toDate().toDateString(),
                endDate: data.endDate.toDate().toDateString()
              }

              for (let j = 0; j < bots.length; j++) {
                if (change.doc.id === bots[j].id) {
                  bots.splice(j, 1, editedBot)
                }
              }
            } else if (change.type === 'removed') {
              // Delete the removed bot from the store by compparing it's id with the ones in the store
              for (let i = 0; i < bots.length; i++) {
                if (change.doc.id === bots[i].id) {
                  bots.splice(i, 1)
                  return
                }
              }
            }
          })
          commit('SET_BOTS', [...bots])
          commit('SET_BOT_LOADING', false)
        },
        error => {
          notific({
            dispatch,
            error,
            type: false
          })
          router.push({ name: 'dashboard' })
        }
      )
    },
    setBotDialog({ commit }, val) {
      commit('SET_BOT_DIALOG', val)
    },
    createNewBot({ commit, dispatch }, newBot) {
      commit('SET_CREATING', true)
      db.collection('bots')
        .add(newBot)
        .then(docRef => {
          const newSkill = skill()
          const botId = docRef.id
          newSkill.title = 'start'
          newSkill.color = 'accent'
          newSkill.isMenu = false
          newSkill.botId = botId
          newSkill.createdAt = new Date()
          // After creating a new bot. Add a new skill to it
          db.collection('skills')
            .add(newSkill)
            .then(() => {
              commit('skill/SET_CURRENT_SKILL', newSkill)
              commit('SET_CREATING', false)
              commit('SET_BOT_DIALOG', false)
            })
            .catch(error => {
              // Handle any errors
              notific({
                dispatch,
                error,
                type: false
              })
            })
          // commit('SET_CURRENT_BOT', newBot)
          // this.$router.push({ path: '/edit-bot/:id/1234' })
        })
        .catch(error => {
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false
          })
        })
    },
    updateBotTitle({ rootGetters, dispatch }, botTitle) {
      const currentBot = rootGetters['bot/currentBot']
      const botRef = db.collection('bots').doc(currentBot.id)
      botRef
        .update({
          title: botTitle
        })
        .then(() => {
          // Create a success notification
          notific({
            dispatch,
            message: `Bot title Updated`,
            type: true
          })
        })
        .catch(error => {
          // Create a success notification
          notific({
            dispatch,
            error,
            type: false
          })
        })
    },
    setWebHook({ dispatch }, { bot }) {
      const setBotWebhook = firebase.functions().httpsCallable('setBotWebhook')
      setBotWebhook({ botKey: bot.key })
        .then(result => {
          console.log(`Result of setting webhook`, result)
          // router.push({ name: 'dashboard' })
          // Create a success notification
          notific({
            dispatch,
            message: result.data,
            type: true
          })
        })
        .catch(error => {
          notific({
            dispatch,
            error,
            type: false
          })
        })
    },
    pauseBot({ dispatch, rootGetters }, { bot, status }) {
      const user = rootGetters['user/user']
      const membership = user.membership.plan
      const leadCount = user.leadCount
      let isEligible = false

      if (membership === 'free') {
        isEligible = false
      } else if (membership === 'Starter Plan' && leadCount < 5000) {
        isEligible = true
      } else if (membership === 'Business Plan' && leadCount < 10000) {
        isEligible = true
      } else if (membership === 'Deluxe Plan' && leadCount < 25000) {
        isEligible = true
      } else {
        isEligible = false
      }
      if (status) {
        if (isEligible) {
          const activateBot = firebase.functions().httpsCallable('activateBot')
          activateBot({ botId: bot.id })
            .then(result => {
              // Create a success notification
              notific({
                dispatch,
                message: result.data,
                type: true
              })
            })
            .catch(error => {
              notific({
                dispatch,
                error,
                type: false
              })
            })
        } else {
          notific({
            dispatch,
            message: 'You need to upgrade your plan to activate bot',
            type: false
          })
        }
      } else {
        const botRef = db.collection('bots').doc(bot.id)

        botRef
          .update({
            status
          })
          .then(function() {
            // Create a success notification
            notific({
              dispatch,
              message: 'Bot paused successfully',
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
      }
    },
    deleteBot({ dispatch }, bot) {
      dispatch('app/setConfirmDialog', false, {
        root: true
      })
      dispatch('app/setDeleteAction', '', {
        root: true
      })
      dispatch('app/setDeleteItem', '', {
        root: true
      })
      db.collection('leads')
        .where('botId', '==', bot.id)
        .get()
        .then(function(querySnapshot) {
          // doc.data() is never undefined for query doc snapshots
          if (!querySnapshot.empty) {
            // show dialog to delete leads first
            dispatch('app/setClearLeadsDialog', true, {
              root: true
            })
          } else {
            // delete bot
            db.collection('bots')
              .doc(bot.id)
              .delete()
              .then(function() {
                // Handle Successful deletion
                notific({
                  dispatch,
                  message: 'Bot deleted successfully!',
                  type: true
                })
              })
              .catch(function(error) {
                // Handle any errors
                notific({
                  dispatch,
                  error,
                  type: false
                })
              })
          }
        })
        .catch(function(error) {
          notific({
            dispatch,
            error,
            type: false
          })
        })
    }
  },
  getters: {
    currentBot: state => state.currentBot,
    currentBotId: state => state.currentBotId,
    bots: state => state.bots,
    filter: state => state.filter,
    loading: state => state.loading,
    dialog: state => state.dialog,
    creating: state => state.creating,
    currentTemplate: state => state.currentBot.contest.template,
    socialNetworksAppearance: state => state.currentBot.socialAppearance
  }
}
