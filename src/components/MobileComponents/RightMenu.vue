<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-card color="background">
        <v-list color="background">
          <v-list-item @click="showUserDialog">
            <v-list-item-avatar>
              <img :src="img" alt="default" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>New User</v-list-item-title>
              <v-list-item-subtitle>{{
                user ? user.email : ''
              }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                :class="fav ? 'appBlue--text' : ''"
                icon
                @click="fav = !fav"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list color="background">
          <v-list-item @click="toggleTheme">
            <v-list-item-action>
              <v-switch v-model="mode" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>{{
              mode ? 'Dark Mode' : 'Light Mode'
            }}</v-list-item-title>
          </v-list-item>

          <v-list-item @click="signOut">
            <v-list-item-action>
              <v-icon size="30">mdi-power</v-icon>
            </v-list-item-action>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    fav: true,
    menu: false,
    hints: true
  }),
  computed: {
    ...mapGetters({
      img: 'user/img',
      user: 'auth/user'
    }),
    mode: {
      get() {
        return this.$vuetify.theme.dark
      },
      set() {
        this.toggleTheme()
      }
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
    }
  }
}
</script>
