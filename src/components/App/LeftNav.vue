<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      mini-variant-width="70"
      elevation="12"
      floating
      :permanent="$vuetify.breakpoint.mdAndUp"
      mini-variant
      app
      color="secondary"
    >
      <v-avatar size="50" to="/" class="ma-3">
        <img src="@/assets/logo1.png" alt="telephy-logo" />
      </v-avatar>
      <div class="text-center">
        <HomeIcon
          v-ripple
          :blue="home"
          :margin="50"
          @click="$router.push({ name: 'dashboard' })"
        />
        <FolderIcon v-ripple :blue="folder" :margin="15" />
        <CalendarIcon v-ripple :blue="calendar" :margin="15" />
        <SettingsIcon v-ripple :blue="settings" :margin="15" />
      </div>
      <div class="pt-8 text-center">
        <v-btn
          v-if="!isPro"
          tile
          small
          color="primary"
          class="pulsingButton"
          @click="$router.push({ name: 'checkout' })"
        >
          $PRO
        </v-btn>

        <v-chip v-if="isPro" color="primary" small label outlined>
          {{ pro }}
        </v-chip>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HomeIcon from '@/components/Icons/HomeIcon'
import FolderIcon from '@/components/Icons/FolderIcon'
import CalendarIcon from '@/components/Icons/CalendarIcon'
import SettingsIcon from '@/components/Icons/SettingsIcon'
export default {
  components: {
    HomeIcon,
    FolderIcon,
    CalendarIcon,
    SettingsIcon,
  },

  props: {
    home: {
      type: Boolean,
      default: true,
    },
    folder: {
      type: Boolean,
      default: true,
    },
    calendar: {
      type: Boolean,
      default: true,
    },
    settings: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters({
      leftDrawer: 'app/leftDrawer',
      editorDrawer: 'app/editorDrawer',
      user: 'user/user',
    }),
    drawer: {
      get() {
        return this.leftDrawer
      },
      set(val) {
        this.$store.commit('app/SET_LEFT_DRAWER', val)
      },
    },
    isPro() {
      return this.user ? this.user.membership.plan !== 'free' : false
    },
    pro() {
      return this.user ? this.user.membership.plan.replace(' Plan', '') : ''
    },
  },
}
</script>

<style scoped>
#left-bar {
  background-color: rgb(25, 21, 71);
  height: 100vh;
  width: 70px;
  position: fixed;
  font-size: 35px;
  color: white;
  z-index: 100;
}
/* Basic button styling */

.pulsingButton {
  box-shadow: 0 0 0 0 rgba(0, 162, 225, 0.7);
  -webkit-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  -moz-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  -ms-animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  animation: pulsing 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  transition: all 300ms ease-in-out;
}

/* Comment-out to have the button continue to pulse on mouseover */

.pulsingButton:hover {
  -webkit-animation: none;
  -moz-animation: none;
  -ms-animation: none;
  animation: none;
  color: #ffffff;
}

/* Animation */

@-webkit-keyframes pulsing {
  to {
    box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
  }
}

@-moz-keyframes pulsing {
  to {
    box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
  }
}

@-ms-keyframes pulsing {
  to {
    box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
  }
}

@keyframes pulsing {
  to {
    box-shadow: 0 0 0 30px rgba(232, 76, 61, 0);
  }
}
</style>
