<template>
  <v-overlay color="appDeepBlue" z-index="50" :value="loading" opacity="0.8">
    <v-avatar size="400">
      <img src="/Telephy-loading-icon.gif" alt="" />
    </v-avatar>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      loading: 'auth/loading'
    })
  }
}
</script>

<style></style>
