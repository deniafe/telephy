import firebase from 'firebase'
import { actionMenu } from '@/utils/menu'
import { action } from '@/utils/skill'
// import notific from '@/utils/notificFunc'
import { db } from '@/plugins/firebase'

export default {
  namespaced: true,
  state: () => {
    return {
      actionMenu: actionMenu(),
      rightPanel: false,
      actionControl: false,
      currentAction: null,
      currentActionMenu: null,
      currentActionImage: {}
    }
  },
  mutations: {
    SET_RIGHT_PANEL(state, status) {
      state.rightPanel = status
    },
    TOGGLE_ACTION_CONTROL(state) {
      state.actionControl = !state.actionControl
    },
    SET_CURRENT_ACTION(state, action) {
      state.currentAction = action
    },
    SET_CURRENT_ACTION_MENU(state, actionMenu) {
      state.currentActionMenu = actionMenu
    },
    CLEAR_ACTION_MENU(state) {
      state.currentActionMenu = null
    },
    CLEAR_ACTION(state) {
      state.currentAction = null
    },
    SET_CURRENT_ACTION_IMAGE(state, file) {
      state.currentActionImage = file
    },
    // This has been moved to the database
    ADD_ACTION(state, { title, body }) {
      const skill = state.currentSkill
      const newAction = action()
      newAction.title = title
      newAction.body = body
      skill.actions.push(newAction)
      state.currentAction = newAction
    },
    // This has been moved to the database
    EDIT_ACTION(state, { skill, action }) {
      const actions = skill.actions
      for (let i = 0; i < actions.length; i++) {
        if (action.id === actions[i].id) {
          actions[i] = action
        }
      }
    },
    DELETE_ACTION(state, { action, actions }) {
      for (let i = 0; i < actions.length; i++) {
        if (action === actions[i]) {
          actions.splice(i, 1)
          return
        }
      }
    }
  },
  actions: {
    addAction({ commit, rootGetters }, { selectType, body }) {
      const newAction = action()
      const currentSkill = rootGetters['skill/currentSkill']
      newAction.title = selectType
      newAction.body = body
      const skillRef = db.collection('skills').doc(currentSkill.id)
      skillRef.update({
        actions: firebase.firestore.FieldValue.arrayUnion(newAction)
      })
      commit('SET_RIGHT_PANEL', false)
    },
    editAction({ commit, rootGetters }, data) {
      commit('EDIT_ACTION', data)
      const currentSkill = rootGetters['skill/currentSkill']
      const skillRef = db.collection('skills').doc(data.skill.id)
      skillRef.update({
        actions: currentSkill.actions
      })

      commit('SET_RIGHT_PANEL', false)
      commit('CLEAR_ACTION')
    },
    setCurrentActionImage({ commit }, file) {
      commit('SET_CURRENT_ACTION_IMAGE', file)
    },
    deleteAction({ commit, rootGetters }, action) {
      const currentSkill = rootGetters['skill/currentSkill']
      commit('DELETE_ACTION', { action, actions: currentSkill.actions })
      const skillRef = db.collection('skills').doc(currentSkill.id)
      skillRef.update({
        actions: firebase.firestore.FieldValue.arrayRemove(action)
      })
    }
  },
  getters: {
    rightPanel: state => state.rightPanel,
    actionControl: state => state.actionControl,
    actionMenu: state => state.actionMenu,
    currentAction: state => state.currentAction,
    currentActionMenu: state => state.currentActionMenu,
    currentActionImage: state => state.currentActionImage
  }
}
