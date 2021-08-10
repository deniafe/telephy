<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="100"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-card
          v-if="$vuetify.breakpoint.mdAndUp"
          id="new-skill"
          class="mb-2"
          @click="$emit('click')"
          v-on="on"
        >
          <div class="text-center pt-8">
            <small>Click here to add a new skill</small>
          </div>
        </v-card>
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          class="mb-2"
          text
          color="appBlue"
          v-on="on"
        >
          <v-icon left>mdi-plus-box</v-icon>
          Add Skill
        </v-btn>
      </template>
      <v-card color="accent">
        <div class="font-weight-bold pl-4 pb-2 pt-2">Bot Skills</div>
        <v-divider></v-divider>
      </v-card>

      <v-card flat color="accent">
        <v-card
          v-for="(item, index) in skillMenu"
          :key="index"
          color="accent"
          flat
          ripple
          @click="addSkill(item.title)"
        >
          <div style="cursor: pointer" class="caption pa-4">
            {{ item.title }}
          </div>
        </v-card>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  data: () => ({
    showMenu: false,
    menu: false,
    x: 0,
    y: 0
  }),
  computed: {
    ...mapGetters({
      skillMenu: 'skill/skillMenu',
      currentBot: 'bot/currentBot',
      currentBotId: 'bot/currentBotId'
    }),
    name() {
      return this.data
    }
  },
  methods: {
    addSkill(skillTitle) {
      if (skillTitle === 'Custom Skill') {
        this.$store.commit('skill/TOGGLE_SKILL_CONTROL', true)
      } else {
        this.$store.dispatch('skill/addSkill', {
          title: skillTitle,
          original: skillTitle
        })
        this.menu = false
      }
    }
  }
}
</script>

<style scoped>
#new-skill {
  height: 120px;
  width: 120px;
  background-color: transparent;
  border: dashed 1px #bac5d4;
}
</style>
