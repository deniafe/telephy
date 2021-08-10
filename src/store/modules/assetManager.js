import uuid from '@/utils/uuid'
import notific from '@/utils/notificFunc'
import { storage, db } from '@/plugins/firebase'

export default {
  namespaced: true,
  state: () => {
    return {
      showAssetManager: false,
      uploading: 0,
      loading: false,
      files: [],
      type: '',
      component: ''
    }
  },
  mutations: {
    SHOW_ASSET_MANAGER(state, status) {
      state.showAssetManager = status
    },
    SET_UPLOADING(state, num) {
      state.uploading = num
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_FILES(state, files) {
      state.files = files
    },
    SET_TYPE(state, type) {
      state.type = type
    },
    SET_COMPONENT(state, component) {
      state.component = component
    }
  },
  actions: {
    setType({ commit }, type) {
      commit('SET_TYPE', type)
    },
    setComponent({ commit }, component) {
      commit('SET_COMPONET', component)
    },
    uploadFile({ commit, dispatch, rootGetters }, val) {
      commit('SET_UPLOADING', 10)

      const userId = rootGetters['auth/user'].id

      const fileId = uuid()

      const fileName = `${fileId}-${val.name}`
      // file path
      const filePath = `${userId}/${fileName}`
      // create a storage ref
      const storageRef = storage.ref(filePath)
      // upload file
      const task = storageRef.put(val)
      // update progress bar
      task.on(
        'state_changed',
        function progress(snapshot) {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          commit('SET_UPLOADING', progress)
        },
        function error(error) {
          commit('SET_UPLOADING', 0)
          // Handle any errors
          notific({
            dispatch,
            error,
            type: false
          })
        },
        function complete() {
          // When the upload is successful we need to get the url of the upload
          // because we will be needing it
          commit('SET_LOADING', true)
          commit('SET_UPLOADING', 0)
          storageRef
            .getDownloadURL()
            .then(function(url) {
              // vm.$emit('input', { name: val.name, url })
              db.collection('files')
                .add({
                  name: fileName,
                  url,
                  userId
                })
                .then(() => {
                  commit('SET_LOADING', false)
                  // Handle any errors
                  notific({
                    dispatch,
                    message: 'File Uploaded Successfully',
                    type: true
                  })
                })
                .catch(error => {
                  commit('SET_LOADING', false)
                  // Handle any errors
                  notific({
                    dispatch,
                    error,
                    type: false
                  })
                })
            })
            .catch(function(error) {
              commit('SET_LOADING', false)
              // Handle any errors
              notific({
                dispatch,
                error,
                type: false
              })
            })
        }
      )
    },
    getFiles({ commit, rootGetters }) {
      const files = []
      const userId = rootGetters['auth/user'].id
      db.collection('files')
        .where('userId', '==', userId)
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges()
          let data
          changes.forEach(change => {
            if (change.type === 'added') {
              data = change.doc.data()
              files.push({
                id: change.doc.id,
                name: data.name,
                url: data.url
              })
            } else if (change.type === 'removed') {
              // Delete from the store
              // commit('DELETE_SKILL', change.doc.id)
              for (let i = 0; i < files.length; i++) {
                if (change.doc.id === files[i].id) {
                  files.splice(i, 1)
                  return
                }
              }
            }
          })
          commit('SET_FILES', [...files])
        })
    },
    selectFile({ state, dispatch, rootGetters }, file) {
      // The select file method will work with so many components, so it will really be bigger than this
      const userId = rootGetters['auth/user'].id
      // Get the current skill which will be the skill we are working with
      // Also get the current bot, we will need it later
      // const skill = rootGetters['skill/currentSkill']
      // const currentAction = rootGetters['action/currentAction']
      // const botId = rootGetters['bot/currentBotId']

      let Ref
      let action
      let message

      if (state.component === 'profile') {
        action = 'user/setUserImg'
        message = 'Profile picture set successfully'
        Ref = db
          .collection('users')
          .doc(userId)
          .update({
            profileImage: file
          })
      } else if (state.component === 'addImageEditor') {
        dispatch('action/setCurrentActionImage', file, { root: true })
        return
      } else if (state.component === 'editImageEditor') {
        dispatch('action/setCurrentActionImage', file, { root: true })
        return
      } else if (state.component === 'addDocumentEditor') {
        dispatch('action/setCurrentActionImage', file, { root: true })
        return
      } else if (state.component === 'editDocumentEditor') {
        dispatch('action/setCurrentActionImage', file, { root: true })
        return
      } else if (state.component === 'addTextImageEditor') {
        dispatch('action/setCurrentActionImage', file, { root: true })
        return
      } else if (state.component === 'editTextImageEditor') {
        dispatch('action/setCurrentActionImage', file, { root: true })
        return
      } else if (state.component === 'addRewardImage') {
        dispatch('botSetting/setCurrentRewardImage', file, { root: true })
        return
      } else if (state.component === 'addRewardFile') {
        dispatch('botSetting/setCurrentRewardFile', file, { root: true })
        return
      } else if (state.component === 'addSocialImage') {
        dispatch('botSetting/setCurrentSocialImage', file, { root: true })
        return
      } else if (state.component === 'addNotificationImage') {
        dispatch('botSetting/setCurrentNotificationImage', file, { root: true })
        return
      } else if (state.component === 'addMessageImage') {
        dispatch('lead/setCurrentMessageImage', file, { root: true })
        return
      }
      Ref.then(function() {
        dispatch(action, file, {
          root: true
        })
        // Create a success notification
        notific({
          dispatch,
          message,
          type: true
        })
      }).catch(function(error) {
        // The document probably doesn't exist.
        // Handle any errors
        notific({
          dispatch,
          error,
          type: false
        })
      })
    },
    deleteFile({ dispatch, rootGetters }, file) {
      // First check if the image is being used as a profile image
      // This will be checking for other files being used in other components as we go further
      const userImg = rootGetters['user/userImg']
      if (file.id === userImg.id) {
        dispatch('user/deleteUserImg', null, {
          root: true
        })
      }
      // File deleted successfully
      db.collection('files')
        .doc(file.id)
        .delete()
        .then(function() {
          // Handle any errors
          notific({
            dispatch,
            message: 'File deleted successfully!',
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
    showAssetManager: state => state.showAssetManager,
    uploading: state => state.uploading,
    loading: state => state.loading,
    files: state => state.files,
    type: state => state.type,
    component: state => state.component
  }
}
