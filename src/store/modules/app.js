export default {
  namespaced: true,
  state: () => {
    return {
      leftDrawer: false,
      confirmDialog: false,
      clearLeadsDialog: false,
      deleteAction: '',
      deleteItem: '',
      confirmationText: '',
      confirmationSubText: '',
      confirmationYes: '',
      confirmationNo: '',
      currentEmoji: '',
      errors: [],
    }
  },
  mutations: {
    SET_LEFT_DRAWER(state, status) {
      if (status) {
        state.leftDrawer = status
        return
      }
      state.leftDrawer = !state.leftDrawer
    },
    SET_CONFIRM_DIALOG(state, status) {
      state.confirmDialog = status
    },
    SET_CLEAR_LEADS_DIALOG(state, status) {
      state.clearLeadsDialog = status
    },
    SET_CONFIRMATION_TEXT(state, text) {
      state.confirmationText = text
    },
    SET_CONFIRMATION_SUB_TEXT(state, text) {
      state.confirmationSubText = text
    },
    SET_CONFIRMATION_YES(state, text) {
      state.confirmationYes = text
    },
    SET_CONFIRMATION_NO(state, text) {
      state.confirmationNo = text
    },
    SET_CURRENT_EMOJI(state, emoji) {
      state.currentEmoji = emoji
    },
    SET_DELETE_ACTION(state, action) {
      state.deleteAction = action
    },
    SET_DELETE_ITEM(state, item) {
      state.deleteItem = item
    },
    SET_ERROR(state, errors) {
      state.errors = errors
    },
  },
  actions: {
    setConfirmDialog({ commit }, status) {
      commit('SET_CONFIRM_DIALOG', status)
    },
    setClearLeadsDialog({ commit }, status) {
      commit('SET_CLEAR_LEADS_DIALOG', status)
    },
    setDeleteAction({ commit }, action) {
      commit('SET_DELETE_ACTION', action)
    },
    setDeleteItem({ commit }, item) {
      commit('SET_DELETE_ITEM', item)
    },
  },
  getters: {
    leftDrawer: state => state.leftDrawer,
    confirmDialog: state => state.confirmDialog,
    clearLeadsDialog: state => state.clearLeadsDialog,
    confirmationText: state => state.confirmationText,
    confirmationSubText: state => state.confirmationSubText,
    confirmationYes: state => state.confirmationYes,
    confirmationNo: state => state.confirmationNo,
    currentEmoji: state => state.currentEmoji,
    deleteAction: state => state.deleteAction,
    deleteItem: state => state.deleteItem,
    errors: state => state.errors,
  },
}
