<template>
  <div color="background" class="mx-0 pa-0">
    <Toolbar />
    <div class="text-center mt-12"></div>
    <Skill v-if="$vuetify.breakpoint.mdAndUp" />
    <MobileSkill v-if="$vuetify.breakpoint.smAndDown" />
    <RightNav />
    <!-- <EditAction /> -->
    <EditSkill />
    <NewCustomSkill />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Toolbar from '@/components/Skill/Toolbar'
import Skill from '@/components/Skill/Skill'
import MobileSkill from '@/components/Skill/MobileSkill'
// import EditAction from '@/components/Action/EditAction'
import EditSkill from '@/components/Skill/EditSkill'
import NewCustomSkill from '@/components/Skill/NewCustomSkill'

export default {
  components: {
    Toolbar,
    Skill,
    MobileSkill,
    EditSkill,
    // EditAction,
    NewCustomSkill
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      bots: 'bot/bots',
      user: 'auth/user'
    }),
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    bots(newValue) {
      if (newValue.length > 0) {
        this.$store.dispatch('bot/setCurrentBot', { id: this.id })
      }
    }
  },
  created() {
    this.$store.commit('bot/SET_CURRENT_BOT_ID', this.id)
  },
  mounted() {
    if (!this.user) this.$store.dispatch('auth/checkAuth')
  },
  head() {
    return {
      title: 'Bot #' + this.id,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Edit bot #' + this.id
        }
      ]
    }
  }
}
</script>
