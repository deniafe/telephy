<template>
  <div>
    <AppError />
    <v-btn text @click="toggleTheme">
      <small class="mr-3 appBlue--text"
        >{{ mode ? 'Light Mode' : 'Dark Mode' }}
      </small>
      <v-icon size="15">{{
        mode ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent'
      }}</v-icon>
    </v-btn>

    <small class="mr-3 ml-6">{{ user ? user.email : '' }}</small>
    <v-btn class="mr-0" icon>
      <v-avatar size="36" color="blue" @click="showUserDialog">
        <img :src="img" alt="default" />
      </v-avatar>
    </v-btn>

    <!-- The notification system for users -->
    <v-menu v-model="menu" :close-on-content-click="false" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mr-2" icon v-bind="attrs" v-on="on">
          <v-badge
            :content="message"
            :value="message"
            color="appPink"
            dot
            overlap
          >
            <v-icon> mdi-bell-outline </v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card color="accent">
        <v-list color="accent">
          <v-list-item>
            <v-list-item-avatar>
              <v-icon size="20">mdi-email-open</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>User Messages</v-list-item-title>
              <v-list-item-subtitle>3 Unread</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list color="accent">
          <v-list-item
            v-for="(notific, index) in notifications"
            :key="index"
            @click="setMessage(notific, index)"
          >
            <v-list-item-action>
              <v-icon size="20">mdi-email-open</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              {{ notific.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-btn icon @click="signOut">
      <v-icon size="30">mdi-power</v-icon>
    </v-btn>
  </div>
</template>

<script>
import AppError from '@/components/App/AppError'
import { mapGetters } from 'vuex'
export default {
  components: {
    AppError
  },
  data: () => ({
    menu: false
  }),
  computed: {
    ...mapGetters({
      img: 'user/img',
      user: 'auth/user',
      notifications: 'user/notifications'
    }),
    message() {
      let message = false
      const note = this.notifications
      for (let i = 0; i < note.length; i++) {
        if (!note[i].seen) {
          message = true
          break
        }
      }
      return message
    },
    mode() {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.themes.dark.anchor = '#41B883'
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    signOut() {
      this.$store.dispatch('auth/signOut')
    },
    showUserDialog() {
      this.$store.commit('user/SET_DIALOG', true)
    },
    setMessage(message, index) {
      this.$store.dispatch('user/readMessage', index)
      this.$store.commit('user/SET_CURRENT_MESSAGE', message)
    }
  }
}
</script>
