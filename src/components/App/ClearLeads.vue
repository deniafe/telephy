<template>
  <v-dialog v-model="dialog" overlay-color="black" class="ma-0" max-width="400">
    <v-card flat class="pa-4" color="accent">
      <v-card-title>
        <span class="text-h6 text-center">This Bot Has Leads</span>
      </v-card-title>
      <v-card-subtitle class="pt-4">
        Please delete the leads on this bot before the bot can be deleted.
      </v-card-subtitle>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      clearLeadsDialog: 'app/clearLeadsDialog'
    }),
    dialog: {
      get() {
        return this.clearLeadsDialog
      },
      set(val) {
        this.$store.commit('app/SET_CLEAR_LEADS_DIALOG', val)
      }
    }
  },
  methods: {
    closeDialog() {
      this.$store.commit('app/SET_CLEAR_LEADS_DIALOG', false)
    },
    deleteAction() {
      this.action()
      // close the dialog pop up
      this.$store.commit('app/SET_CLEAR_LEADS_DIALOG', false)
    }
  }
}
</script>
