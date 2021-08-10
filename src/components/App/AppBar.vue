<template>
  <div>
    <v-app-bar color="accent" fixed app>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="setDrawer"
      />
      <v-toolbar-title class="ml-md-10">Telephy Viral Bot</v-toolbar-title>
      <v-spacer />
      <TopMDMenu v-if="$vuetify.breakpoint.mdAndUp" />
      <RightMobileMenu v-if="$vuetify.breakpoint.smAndDown" />
      <!-- This button is suppose to be used for editing bot actions and I will get to it later when adding the bot builder -->
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
  </div>
</template>

<script>
import RightMobileMenu from '@/components/MobileComponents/RightMenu'
import TopMDMenu from '@/components/DesktopComponents/TopMenu'
export default {
  components: {
    RightMobileMenu,
    TopMDMenu
  },
  methods: {
    setDrawer() {
      this.$store.commit('app/SET_LEFT_DRAWER')
    }
  }
}
</script>

<style></style>
