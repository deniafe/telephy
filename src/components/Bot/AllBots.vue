<template>
  <div id="body">
    <v-card flat tile class="pr-8 pt-8" color="#150e3a">
      <v-row>
        <NewBotToolbar />
      </v-row>
      <v-row>
        <v-col cols="12">
          <TemplateCard v-for="(bot, i) in bots" :key="i" :bot="bot" />
          <div
            v-if="bots.length == 0 && !botLoading"
            class="headline text-center pt-4"
          >
            You have no bot yet. Click the button above to create a new bot
          </div>
          <div class="text-center">
            <v-progress-circular
              v-if="botLoading"
              indeterminate
              color="appBlue"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NewBotToolbar from '@/components/Bot/NewBotToolbar'
import TemplateCard from '@/components/Bot/TemplateCard'
export default {
  components: {
    NewBotToolbar,
    TemplateCard
  },
  computed: {
    ...mapGetters({
      bots: 'bot/bots',
      botLoading: 'bot/loading'
    })
  }
}
</script>

<style scoped>
#body {
  margin-left: 50px;
}
</style>
