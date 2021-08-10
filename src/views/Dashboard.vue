<template>
  <div class="pa-0 mx-0">
    <Analytics />
    <BotTemplates />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Analytics from '@/components/App/Analytics'
import BotTemplates from '@/components/Bot/BotTemplates'
export default {
  components: {
    Analytics,
    BotTemplates,
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },
  mounted() {
    if (!this.user) this.$store.dispatch('auth/checkAuth')
  },
  head() {
    return {
      title: 'Dashboard',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'See all information on user dashboard',
        },
      ],
    }
  },
}
</script>
