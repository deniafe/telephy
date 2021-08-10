<template>
  <v-container>
    <v-card
      color="background"
      class="px-sm-8 pb-4 pt-2"
      flat
      :style="skillStyle"
    >
      <NewSkill @click="show = null" />
      <v-card
        v-if="skill"
        flat
        color="accent"
        height="95%"
        class="px-sm-4 py-4"
      >
        <v-row>
          <v-col class="pa-0 pl-2 pl-sm-0 ma-0" cols="6" sm="9">
            <v-card-title>{{ skill.title }}</v-card-title>
          </v-col>
          <v-col class="pa-0 pt-4 ma-0" cols="2" sm="1">
            <NewAction />
          </v-col>
          <v-col class="pa-0 pt-4 pl-sm-4 pl-2 ma-0" cols="2" sm="1">
            <v-btn icon color="appBlue" @click.stop="showEditSkill">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-col>
          <v-col class="pa-0 pt-4 pl-sm-2 ma-0" cols="2" sm="1">
            <v-btn icon color="appPink" @click.stop="confirmDelete">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card
          color="appDeepBlue"
          style="overflow-y: auto"
          height="80%"
          flat
          class="px-sm-8 pa-4"
        >
          <div v-if="skill">
            <v-card
              v-for="(action, index) in skill.actions"
              :key="index"
              color="accent"
              flat
              class="pa-4 mb-3"
              @click="editAction(action)"
            >
              <v-row class="pa-0 ma-0">
                <v-col class="pa-0 ma-0" cols="11" sm="11">
                  <div class="mt-2">
                    Step {{ index + 1 }}: {{ action.title }}
                  </div>
                </v-col>
                <v-col class="pa-0 ma-0" cols="1" sm="1">
                  <div class="pt-2">
                    <v-icon color="appPink" @click.stop="deleteAction(action)"
                      >mdi-close</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-card>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NewSkill from '@/components/Skill/NewSkill'
import NewAction from '@/components/Action/NewAction'
export default {
  components: {
    NewSkill,
    NewAction
  },
  data() {
    return {
      browserHeight: ''
    }
  },
  computed: {
    ...mapGetters({
      currentBot: 'bot/currentBot',
      currentSkill: 'skill/currentSkill',
      skills: 'skill/skills'
    }),
    skillStyle() {
      const style = {
        height: this.browserHeight - 100 + 'px'
      }
      return style
    },
    skill() {
      return this.currentSkill || this.skills[0]
    }
  },
  mounted() {
    this.browserHeight = document.body.clientHeight
    this.$store.dispatch('skill/getSkills')
  },
  methods: {
    confirmDelete() {
      // Open the dialog pop up
      this.$store.commit('app/SET_DELETE_ACTION', this.deleteSkill)
      this.$store.commit(
        'app/SET_CONFIRMATION_TEXT',
        'Are you sure you want to delete?'
      )
      this.$store.commit(
        'app/SET_CONFIRMATION_SUB_TEXT',
        'Deleting a skill is a permanent action and cannot be reversed'
      )
      this.$store.commit('app/SET_CONFIRMATION_YES', 'Yes Delete')
      this.$store.commit('app/SET_CONFIRMATION_NO', `No Don't delete`)
      this.$store.commit('app/SET_CONFIRM_DIALOG', true)
    },
    showEditSkill() {
      this.$store.commit('skill/SET_CURRENT_EDIT_SKILL', this.skill)
      this.$store.commit('skill/TOGGLE_EDIT_SKILL_CONTROL', true)
    },
    deleteSkill() {
      this.$store.dispatch('skill/deleteSkill', this.skill)
      this.$store.commit('skill/SET_CURRENT_SKILL', '')
    },
    editAction(action) {
      if (!this.currentAction) {
        this.$store.commit('action/CLEAR_ACTION_MENU')
        this.$store.commit('action/CLEAR_ACTION')
        this.$store.commit('action/SET_CURRENT_ACTION', action)
      } else if (this.currentAction && action.id !== this.currentAction.id) {
        this.$store.commit('action/CLEAR_ACTION_MENU')
        this.$store.commit('action/SET_CURRENT_ACTION', action)
      } else if (this.currentAction && action.id === this.currentAction.id) {
        this.$store.commit('action/CLEAR_ACTION_MENU')
      }
      this.$store.commit('action/SET_RIGHT_PANEL', true)
    },
    deleteAction(action) {
      this.$store.dispatch('action/deleteAction', action)
    }
  }
}
</script>

<style scoped></style>
