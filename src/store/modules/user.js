import firebase from 'firebase'
import { db } from '@/plugins/firebase'
import notific from '@/utils/notificFunc'

export default {
  namespaced: true,
  state: () => {
    return {
      dialog: false,
      user: '',
      userImg: '',
      notifications: [],
      currentMessage: '',
      defaultImg:
        '//s3.amazonaws.com/appforest_uf/f1569453750525x910489486140673200/profile.png'
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_DIALOG(state, status) {
      state.dialog = status
    },
    SET_USER_IMG(state, imgFile) {
      state.userImg = imgFile
    },
    SET_USER_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications
    },
    SET_CURRENT_MESSAGE(state, message) {
      state.currentMessage = message
    }
  },
  actions: {
    getUser({ commit, rootGetters }) {
      const user = rootGetters['auth/user']
      // if (!user) return

      const userId = user.id

      const userRef = db.collection('users').doc(userId)

      userRef.onSnapshot(snapshot => {
        const data = snapshot.data()
        const imgFile = data.profileImage
        const notifications = data.notifications
        commit('SET_USER_IMG', imgFile)
        commit('SET_USER_NOTIFICATIONS', notifications)
        commit('SET_USER', data)
      })
    },
    editUserSettings({ dispatch }, data) {
      const editUserSettings = firebase
        .functions()
        .httpsCallable('editUserSettings')
      editUserSettings(data)
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
    },
    readMessage({ state }, { index }) {
      const notifications = { ...state.user.notifications }
      for (let i = 0; i < notifications.length; i++) {
        if (index === i) {
          notifications[i].seen = true
        }
      }
      const readMessage = firebase.functions().httpsCallable('readMessage')
      readMessage({ notifications })
    },
    setUserImg({ commit }, imgFile) {
      commit('SET_USER_IMG', imgFile)
    },
    deleteUserImg({ commit, dispatch, rootGetters }) {
      const userId = rootGetters['auth/user'].id

      const userRef = db.collection('users').doc(userId)

      // Set the image field of this user
      return userRef
        .update({
          profileImage: ''
        })
        .then(function() {
          commit('SET_USER_IMG', '')
          notific({
            dispatch,
            message: 'User Profile Image Deleted',
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
  },
  getters: {
    user: state => state.user,
    dialog: state => state.dialog,
    userImg: state => state.userImg,
    notifications: state => state.notifications,
    currentMessage: state => state.currentMessage,
    defaultImg: state => state.defaultImg,
    img: state => {
      return state.userImg ? state.userImg.url : state.defaultImg
    }
  }
}
