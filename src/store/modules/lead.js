import { db } from '@/plugins/firebase'
import notific from '@/utils/notificFunc'
import router from '@/router/index.js'

export default {
  namespaced: true,
  state: () => {
    return {
      leads: [],
      selectedLeads: [],
      filtered: true,
      loading: false,
      message: '',
      messageDialog: false,
      currentLead: '',
      isMultiple: false,
      currentMessageImage: ''
    }
  },
  mutations: {
    SET_LEADS(state, leads) {
      state.leads = leads
    },
    SET_SELECTED_LEADS(state, leads) {
      state.selectedLeads = leads
    },
    SELECT_LEAD(state, lead) {
      state.selectedLeads.push(lead)
    },
    DESELECT_LEAD(state, lead) {
      const leads = state.selectedLeads
      for (let i = 0; i < leads.length; i++) {
        if (leads[i] === lead) {
          leads.splice(i, 1)
          return
        }
      }
    },
    SET_FILTERED(state, status) {
      state.filtered = status
    },
    SET_LEADS_LOADING(state, status) {
      state.loading = status
    },
    SET_MESSAGE_DIALOG(state, status) {
      state.messageDialog = status
    },
    SET_CURRENT_LEAD(state, lead) {
      state.currentLead = lead
    },
    SET_IS_MULTIPLE(state, status) {
      state.isMultiple = status
    },
    SET_CURRENT_MESSAGE_IMAGE(state, file) {
      state.currentMessageImage = file
    }
  },
  actions: {
    getLeads({ commit, rootGetters, dispatch }) {
      commit('SET_LEADS_LOADING', true)
      const botKey = rootGetters['bot/currentBot'].key

      const leads = []
      db.collection('leads')
        .where('botKey', '==', botKey)
        .onSnapshot(
          snapshot => {
            const changes = snapshot.docChanges()
            let data
            // console.log(changes)
            changes.forEach(change => {
              if (change.type === 'added') {
                data = change.doc.data()
                leads.push({
                  id: change.doc.id,
                  botKey: data.botKey,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email,
                  refPoints: data.refPoints,
                  registeredAt: data.registeredAt.toDate().toDateString(),
                  socialPoints: data.socialPoints,
                  referrals: data.referrals,
                  referredBy: data.referredBy,
                  telegramUserId: data.telegramUserId
                })
              } else if (change.type === 'modified') {
                data = change.doc.data()
                const editedLead = {
                  id: change.doc.id,
                  botKey: data.botKey,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  refPoints: data.refPoints,
                  registeredAt: data.registeredAt.toDate().toDateString(),
                  referrals: data.referrals,
                  referredBy: data.referredBy,
                  telegramUserId: data.telegramUserId
                }

                for (let j = 0; j < leads.length; j++) {
                  if (change.doc.id === leads[j].id) {
                    leads.splice(j, 1, editedLead)
                  }
                }
              } else if (change.type === 'removed') {
                for (let i = 0; i < leads.length; i++) {
                  if (change.doc.id === leads[i].id) {
                    leads.splice(i, 1)
                    return
                  }
                }
              }
            })
            commit('SET_LEADS_LOADING', false)
            commit('SET_LEADS', [...leads])
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
    setCurrentMessageImage({ commit }, file) {
      commit('SET_CURRENT_MESSAGE_IMAGE', file)
    },
    deleteLead({ dispatch }, lead) {
      dispatch('app/setConfirmDialog', false, {
        root: true
      })
      dispatch('app/setDeleteAction', '', {
        root: true
      })
      dispatch('app/setDeleteItem', '', {
        root: true
      })
      // File deleted successfully
      db.collection('leads')
        .doc(lead.id)
        .delete()
        .then(function() {
          // Handle Successful deletion
          notific({
            dispatch,
            message: 'Lead deleted successfully!',
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
    },
    deleteSelectedLeads({ dispatch }, leads) {
      const leadRef = db.collection('leads')
      for (let i = 0; i < leads.length; i++) {
        const lead = leads[i]
        // File deleted successfully
        leadRef
          .doc(lead.id)
          .delete()
          .then(function() {
            // Handle Successful deletion
            notific({
              dispatch,
              message: 'Lead deleted successfully!',
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
    }
  },
  getters: {
    leads: state => state.leads,
    selectedLeads: state => state.selectedLeads,
    filtered: state => state.filtered,
    loading: state => state.loading,
    message: state => state.message,
    messageDialog: state => state.messageDialog,
    currentLead: state => state.currentLead,
    isMultiple: state => state.isMultiple,
    currentMessageImage: state => state.currentMessageImage
  }
}
