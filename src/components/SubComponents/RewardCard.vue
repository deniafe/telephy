<template>
  <!-- The added rewards cards -->
  <div class="mx-sm-6 mt-8 mb-6">
    <v-card
      v-for="(reward, index) in currentBot.rewards"
      :key="index"
      elevation="1"
      class="mx-md-12 mt-2"
      color="accent"
    >
      <v-row class="pl-5 pl-sm-0 ma-0" wrap>
        <v-col v-if="$vuetify.breakpoint.smAndUp" sm="2" md="1">
          <!-- <div class="caption grey--text">Status</div> -->
          <div class="mt-3 pl-4">
            <v-icon size="30" color="appBlue">mdi-gift-outline</v-icon>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="caption grey--text">Reward Name</div>
          <p class="appBlue--text subtitle-2 mb-1 mt-3">
            {{ reward.name }}
          </p>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <div class="caption grey--text">Reward Type</div>
          <p class="appBlue--text subtitle-2 mb-1 mt-3">
            {{ reward.type }}
          </p>
        </v-col>
        <v-col class="px-sm-0" cols="12" sm="6" md="2">
          <div class="caption grey--text">Reward File</div>
          <div class="caption appBlue--text font-weight-bold mb-1 mt-3">
            {{ reward.file.name }}
          </div>
        </v-col>
        <v-col class="px-sm-0" cols="6" sm="6" md="1">
          <div class="caption grey--text">Points</div>
          <div class="caption appBlue--text font-weight-bold mb-1 mt-3">
            {{ reward.requiredPoints }}
          </div>
        </v-col>
        <!-- Just taking up an empty space -->
        <v-col class="px-0" md="1">
          <div></div>
        </v-col>
        <v-col cols="6" md="1" class="px-0 pl-1">
          <v-menu :nudge-width="50" open-on-hover transition="scale-transition">
            <template v-slot:activator="{ on }">
              <div class="mt-4 pr-0">
                <v-icon ripple color="appBlue" v-on="on">
                  mdi-dots-vertical
                </v-icon>
              </div>
            </template>
            <v-list
              v-for="action in actions"
              :key="action.title"
              color="accent"
              link
            >
              <v-list-item
                link
                nuxt
                @click="menu({ act: action.action, reward, index })"
              >
                <v-list-item-title>{{ action.title }}</v-list-item-title>
                <v-icon small>{{ action.icon }}</v-icon>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      actions: [
        {
          title: 'Edit',
          icon: 'mdi-pencil',
          action: 'edit'
        },
        {
          title: 'Delete',
          icon: 'mdi-delete',
          action: 'delete'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      currentBot: 'bot/currentBot'
    })
  },
  methods: {
    menu({ reward, act, index }) {
      if (act === 'edit') {
        this.$emit('edit', { reward, index })
      } else if (act === 'delete') {
        this.$store.commit('bot/DELETE_REWARD', index)
        // The update reward action works for editing and deleting the rewards
        this.$store.dispatch('botSetting/updateReward')
      }
    }
  }
}
</script>

<style></style>
