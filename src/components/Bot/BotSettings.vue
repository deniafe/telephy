<template>
  <v-dialog
    v-model="settingsDialog"
    fullscreen
    hide-overlay
    :retain-focus="false"
    transition="dialog-bottom-transition"
    color
  >
    <v-card color="background">
      <v-toolbar color="accent">
        <v-btn icon @click="closeSettings">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
        <v-toolbar-title>Set Up Options For Your Bot</v-toolbar-title>
        <v-progress-linear
          v-if="loading"
          indeterminate
          absolute
          bottom
          color="appBlue"
        ></v-progress-linear>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text @click="launchBot">Preview</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <BotOptions />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import BotOptions from '@/components/BotOptions/BotOptions'
export default {
  components: {
    BotOptions
  },
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      botSettings: 'botSetting/botSettings',
      skills: 'skill/skills',
      currentBot: 'bot/currentBot'
    }),
    botSkills() {
      const skills = this.skills.filter(skill => {
        if (skill.botId === this.currentBot.id) {
          return skill
        }
      })
      return skills
    },
    settingsDialog: {
      get() {
        return this.botSettings
      },
      set(val) {
        this.$store.commit('botSetting/OPEN_BOT_SETTINGS', val)
      }
    }
  },
  methods: {
    closeSettings() {
      this.$store.commit('botSetting/OPEN_BOT_SETTINGS', false)
    },
    launchBot() {
      this.loading = true
      this.$store.dispatch('bot/setWebHook', {
        bot: this.currentBot,
        action: 'set'
      })

      this.$store.dispatch('bot/pauseBot', {
        bot: this.currentBot,
        status: true
      })

      this.loading = false
      this.closeSettings()
    }
  }
}
</script>
