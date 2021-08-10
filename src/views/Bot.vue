<template>
  <div>
    <BotAnalytics />
    <LeadTemplates />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BotAnalytics from '@/components/Lead/BotAnalytics'
import LeadTemplates from '@/components/Lead/LeadTemplates'

export default {
  components: {
    BotAnalytics,
    LeadTemplates
  },
  computed: {
    ...mapGetters({
      bots: 'bot/bots',
      user: 'auth/user',
      leads: 'lead/leads',
      currentBot: 'bot/currentBot'
    }),
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    bots(newValue) {
      if (newValue.length > 0 && !this.currentBot) {
        this.$store.dispatch('bot/setCurrentBot', { id: this.id })
      }
    },
    currentBot() {
      if (this.leads.length < 1) {
        this.$store.dispatch('lead/getLeads')
      }
    }
  },
  created() {
    if (!this.currentBot) this.$store.commit('bot/SET_CURRENT_BOT_ID', this.id)
    if (!this.user) this.$store.dispatch('auth/checkAuth')
    if (this.currentBot) this.$store.dispatch('lead/getLeads')
  },
  head() {
    return {
      title: 'Bot #' + this.id,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'What you need to know about bot' + this.id
        }
      ]
    }
  }
}
</script>
