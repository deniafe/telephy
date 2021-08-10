import { skillMenu } from '@/utils/menu'
import { skill } from '@/utils/skill'
import { db } from '@/plugins/firebase'
import notific from '@/utils/notificFunc'
import router from '@/router/index.js'

export default {
  namespaced: true,
  state: () => {
    return {
      skillControl: false,
      editSkillControl: false,
      skillMenu: skillMenu(),
      skills: [],
      currentSkill: null,
      currentEditSkill: ''
    }
  },
  mutations: {
    TOGGLE_SKILL_CONTROL(state, status) {
      state.skillControl = status
    },
    TOGGLE_EDIT_SKILL_CONTROL(state, status) {
      state.editSkillControl = status
    },
    SET_SKILLS(state, skills) {
      state.skills = skills
    },
    // This ha sbeen taken away from the store directly to the database
    ADD_SKILL(state, { title, isMenu }) {
      const bot = state.currentBot
      const newSkill = skill()
      newSkill.title = title
      newSkill.isMenu = isMenu
      newSkill.botId = bot.id
      // bot.skills.push(newSkill)
      state.skills.push(newSkill)
    },
    SET_CURRENT_SKILL(state, skill) {
      state.currentSkill = skill
    },
    SET_CURRENT_EDIT_SKILL(state, skill) {
      state.currentEditSkill = skill
    },
    EDIT_SKILL(state, { skill, val }) {
      for (let i = 0; i < state.skills.length; i++) {
        if (skill === state.skills[i]) {
          state.skills[i].title = val.title
          state.skills[i].isMenu = val.isMenu
        }
      }
    },
    // This has been taken away from the store directly to the database
    DELETE_SKILL(state, skillId) {
      for (let i = 0; i < state.skills.length; i++) {
        if (skillId === state.skills[i].id) {
          state.skills.splice(i, 1)
          return
        }
      }
    }
  },
  actions: {
    // eslint-disable-next-line prettier/prettier
    createSkill({
      state,
      commit
    }, newSkill) {
      const botId = state.currentBot.id
      db.collection('skills')
        .add({
          title: newSkill.title,
          botId,
          isMenu: false,
          createdAt: new Date()
        })
        .then(doc => {
          commit('ADD_SKILLS', {
            title: newSkill.title,
            id: doc.id,
            isMenu: false,
            createdAt: newSkill.createdAt,
            actions: []
          })
        })
    },
    getSkills({ commit, getters, rootGetters, dispatch }) {
      // this.skillLoading = true
      // let botId = this.currentBot.id
      const botId = rootGetters['bot/currentBotId']
      // eslint-disable-next-line no-console
      console.log(botId)
      const skillsUpdate = []
      db.collection('skills')
        .where('botId', '==', botId)
        .orderBy('createdAt')
        .onSnapshot(
          snapshot => {
            const changes = snapshot.docChanges()
            let data
            let skill
            // console.log(changes)
            changes.forEach(change => {
              if (change.type === 'added') {
                data = change.doc.data()
                skill = {
                  id: change.doc.id,
                  botId: data.botId,
                  title: data.title,
                  isMenu: data.isMenu,
                  color: data.color,
                  actions: data.actions
                }
                skillsUpdate.push(skill)
                commit('SET_CURRENT_SKILL', skill)
              } else if (change.type === 'modified') {
                const currentSkill = getters.currentSkill
                data = change.doc.data()
                const editedSkill = {
                  id: change.doc.id,
                  botId: data.botId,
                  title: data.title,
                  isMenu: data.isMenu,
                  color: data.color,
                  actions: data.actions
                }
                for (let j = 0; j < skillsUpdate.length; j++) {
                  if (change.doc.id === skillsUpdate[j].id) {
                    skillsUpdate.splice(j, 1, editedSkill)
                  }
                }
                if (currentSkill && currentSkill.id === change.doc.id) {
                  commit('SET_CURRENT_SKILL', editedSkill)
                }
              } else if (change.type === 'removed') {
                for (let i = 0; i < skillsUpdate.length; i++) {
                  if (change.doc.id === skillsUpdate[i].id) {
                    skillsUpdate.splice(i, 1)
                    return
                  }
                }
              }
            })
            // this.$store.commit('skills/SET_BOT_LOADING', false)
            this.skillLoading = false
            // this.$store.commit('skills/SET_SKILLS', skillsUpdate)
            commit('SET_SKILLS', [...skillsUpdate])
          },
          error => {
            router.push({ name: 'dashboard' })
            notific({
              dispatch,
              error: `There was an error ${error}`,
              type: false
            })
          }
        )
    },
    // eslint-disable-next-line no-empty-pattern
    updateEditedSkill({}, { skill, edited, isMenu, editedColor }) {
      const skillRef = db.collection('skills').doc(skill.id)
      skillRef.update({
        title: edited,
        isMenu: isMenu,
        // original: skill.original,
        color: editedColor
      })
    },
    addSkill({ rootGetters, commit }, { title }) {
      const newSkill = skill()
      const botId = rootGetters['bot/currentBotId']
      newSkill.title = title
      newSkill.color = 'accent'
      newSkill.isMenu = false
      newSkill.botId = botId
      newSkill.createdAt = new Date()
      db.collection('skills').add(newSkill)
      commit('SET_CURRENT_SKILL', newSkill)
    },
    toggleEditSkillControl({ commit }, status) {
      commit('TOGGLE_EDIT_SKILL_CONTROL', status)
    },
    deleteSkill({ dispatch }, skill) {
      dispatch('app/setConfirmDialog', false, {
        root: true
      })
      dispatch('app/setDeleteAction', '', {
        root: true
      })
      dispatch('app/setDeleteItem', '', {
        root: true
      })
      const id = skill.id
      db.collection('skills')
        .doc(id)
        .delete()
    }
  },
  getters: {
    skillControl: state => state.skillControl,
    editSkillControl: state => state.editSkillControl,
    skillMenu: state => state.skillMenu,
    skills: state => state.skills,
    currentSkill: state => state.currentSkill,
    currentEditSkill: state => state.currentEditSkill
  }
}
