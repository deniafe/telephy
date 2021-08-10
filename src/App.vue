<template>
  <v-app :style="style">
    <LeftNav v-if="showLeftNav" />
    <AppBar v-if="showNav" />
    <v-main> <router-view /> </v-main>
    <RightNav />
    <v-snackbar v-model="messageBar" color="appGreen" top :timeout="20000">
      {{ currentMessage.body }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeMessageBar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="snackBar"
      :timeout="timeout"
      :color="notificationColor"
      elevation="24"
      top
      right
    >
      {{ notificationMessage }}
    </v-snackbar>
    <v-snackbar
      v-model="verified"
      :timeout="-1"
      color="appPink"
      elevation="24"
      app
      center
    >
      Your email is not verified. A verification email has been sent to you.
      Follow the instructions to verify your email address.
      <v-btn small color="purple" text @click="verifyEmail">Resend Email</v-btn>
    </v-snackbar>
    <UserSettings />
    <AppAssetManager />
    <TelephyLoading />
    <NewBotDialog />
    <BotSettings />
    <MessageDialog />
    <AppConfirm />
    <ClearLeads />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import LeftNav from '@/components/App/LeftNav'
import RightNav from '@/components/App/RightNav'
import UserSettings from '@/components/App/UserSettings'
import TelephyLoading from '@/components/App/TelephyLoading'
import NewBotDialog from '@/components/Bot/NewBotDialog'
import BotSettings from '@/components/Bot/BotSettings'
import MessageDialog from '@/components/Lead/MessageDialog'
import ClearLeads from '@/components/App/ClearLeads'
export default {
  name: 'App',
  components: {
    LeftNav,
    RightNav,
    UserSettings,
    TelephyLoading,
    NewBotDialog,
    BotSettings,
    MessageDialog,
    ClearLeads,
  },
  data() {
    return {
      timeout: 3000,
      alert: true,
      // messageBar: true,
      text: `Hello, I'm a snackbar`,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      skills: 'skill/skills',
      showNotification: 'notification/status',
      notificationMessage: 'notification/message',
      notificationColor: 'notification/color',
      currentMessage: 'user/currentMessage',
    }),
    verified() {
      let verified
      if (this.user) {
        verified = !this.user.verified
      }
      return verified
    },
    snackBar: {
      get() {
        return this.showNotification
      },
      set(status) {
        this.$store.commit('notification/SET_STATUS', status)
      },
    },
    messageBar: {
      get() {
        let status
        if (this.currentMessage) status = true
        return status
      },
      set(status) {
        if (!status) {
          this.$store.commit('user/SET_CURRENT_MESSAGE', '')
        }
      },
    },
    style() {
      const style = { backgroundColor: '#f8f8f8' }
      if (this.$vuetify.theme.dark) {
        style.backgroundColor = '#150e3a'
      }
      return style
    },
    showNav() {
      const currentRoute = this.$route.name
      return !(
        currentRoute === 'auth' ||
        currentRoute === 'reset-pw' ||
        currentRoute === '404'
      )
    },
    showLeftNav() {
      const currentRoute = this.$route.name
      return !(currentRoute === '404')
    },
  },
  watch: {
    user(newValue) {
      if (newValue) {
        this.$store.dispatch('user/getUser')
        this.$store.dispatch('bot/getBots')
        this.$store.dispatch('app/getErrors')
      }
    },
    skills(newValue) {
      if (newValue) {
        let errors = this.skills.filter(skill => {
          if (skill.actions.length === 0) return skill
        })
        this.$store.commit('app/SET_ERROR', errors)
      }
    },
  },
  mounted() {
    this.$store.dispatch('auth/checkAuth')
  },
  methods: {
    verifyEmail() {
      this.$store.dispatch('auth/sendVerificationEmail')
    },
    closeMessageBar() {
      this.$store.commit('user/SET_CURRENT_MESSAGE', '')
    },
  },
}
</script>

<style type="text/css">
::-webkit-scrollbar {
  width: 1px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 1px;
}

::-webkit-scrollbar-thumb:hover {
  background: transparent;
}
</style>
