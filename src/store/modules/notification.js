export default {
  namespaced: true,
  state: () => {
    return {
      notification: null,
      status: false
    }
  },
  mutations: {
    SET_NOTIFICATION(state, notification) {
      state.notification = notification
    },
    SET_STATUS(state, status) {
      state.status = status
    }
  },
  actions: {
    setNotification({ commit }, notification) {
      commit('SET_NOTIFICATION', notification)
    },
    showNotification({ commit }, status) {
      commit('SET_STATUS', status)
    }
  },
  getters: {
    status: state => state.status,
    message: state => {
      if (state.notification) {
        return state.notification.message
      }
    },
    color: state => {
      let color
      const notification = state.notification
      if (notification) {
        if (notification.type === 'success') {
          color = 'appGreen'
        } else if (notification.type === 'error') {
          color = 'appPink'
        } else if (notification.type === 'info') {
          color = 'appBlue'
        }
      }

      return color
    }
  }
}
