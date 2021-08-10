<template>
  <div>
    <v-card flat color="transparent" class="mb-2">
      <v-row class="my-2 mx-0">
        <!-- The main card part of the bot card -->
        <v-col class="mx-0 pl-0 pr-1 pb-1 pt-0" cols="12" sm="8" md="10">
          <v-card
            color="accent"
            :max-height="$vuetify.breakpoint.smAndUp ? 110 : 150"
            class="mb-2"
            @click="editBot(bot)"
          >
            <v-row class="ma-0">
              <!-- The image part of the card -->
              <v-col class="pl-6 pl-sm-12" cols="4" sm="4" md="2">
                <v-avatar size="80">
                  <img
                    src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fs3.amazonaws.com%2Fappforest_uf%2Ff1597813231198x298532033986626900%2FFB%2520BANNER-1.png?w=96&amp;h=96&amp;auto=compress&amp;fit=crop&amp;dpr=1.5"
                    alt="John"
                  />
                </v-avatar>
              </v-col>
              <!-- The part that contains name and date of the bot -->
              <v-col cols="8" sm="6" md="4">
                <div class="appBlue--text caption py-2">{{ bot.title }}</div>
                <div class="font-weight-medium white--tex pb-2">
                  {{ bot.title }}
                </div>
                <div>
                  <small size="3px">{{ bot.startDate }} ▸ </small>
                  <small class="red--text caption">{{ bot.endDate }}</small>
                </div>
              </v-col>
              <!-- The deep part of the bot card -->
              <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" sm="6" md="6">
                <v-card
                  color="appDeepBlue"
                  width="410"
                  max-width="410"
                  height="80"
                  min-height="80"
                  flat
                >
                  <!-- The first colum that contains the visitors  -->
                  <v-row class="py-0 ma-0">
                    <v-col class="py-1" cols="3">
                      <div
                        style="
                          max-height: 70px;
                          border-right: 1px #bac5d69c solid;
                          max-width: 90px;
                        "
                      >
                        <div class="pt-3 text-center appTextGrey--text caption">
                          All Leads
                        </div>
                        <div
                          class="pt-3 text-center font-weight-medium heading-5"
                        >
                          {{ allLeads }}
                        </div>
                      </div>
                    </v-col>
                    <!-- The second column that contains leads -->
                    <v-col class="py-1" cols="4">
                      <div
                        style="
                          max-height: 70px;
                          border-right: 1px #bac5d69c solid;
                          max-width: 140px;
                        "
                      >
                        <div
                          style="max-width: 60px"
                          class="pt-3 text-center appTextGrey--text caption"
                        >
                          Referrals
                        </div>
                        <div
                          class="pt-3 text-center font-weight-medium heading-5"
                        >
                          <div
                            style="display: inline-block"
                            class="pr-3 text-center font-weight-medium heading-5"
                          >
                            {{ referrals }}
                          </div>
                          <v-chip
                            label
                            small
                            color="appBlue"
                            text-color="white"
                          >
                            <v-avatar left>
                              <v-icon small>mdi-google-analytics</v-icon>
                            </v-avatar>
                            {{ refPercentage }} %
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                    <!-- Third column showing if bot is active or not -->
                    <v-col cols="5">
                      <div class="pt-4 text-center appTextGrey--text caption">
                        Bot Status : {{ bot.status ? 'Active' : 'Inactive' }}
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- The edit card part of the bot card -->
        <v-col class="mx-0 pl-0 pr-1 pb-1 pt-0" cols="6" sm="2" md="1">
          <v-card
            color="accent"
            height="110"
            class="mb-2"
            @click="editBot(bot)"
          >
            <div class="text-center pt-5">
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <div class="text-center pt-2 caption appTextGrey--text">
              Edit Bot
            </div>
          </v-card>
        </v-col>
        <!-- The more options part of the bot -->
        <v-col class="mx-0 pl-0 pr-1 pb-1 pt-0" cols="6" sm="2" md="1">
          <v-menu :offset-x="true">
            <template v-slot:activator="{ on, attrs }">
              <v-card
                v-bind="attrs"
                color="accent"
                height="110"
                class="mb-2"
                v-on="on"
              >
                <div class="text-center pt-5">
                  <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </div>
                <div class="text-center pt-2 caption appTextGrey--text">
                  More Options
                </div>
              </v-card>
            </template>

            <v-list color="accent">
              <v-list-item
                v-for="(item, index) in menu"
                :key="index"
                link
                nuxt
                @click="options({ action: item.title, bot })"
              >
                <v-list-item-content>
                  <v-list-item-subtitle>
                    {{ item.title }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon>
                    <v-icon small> {{ item.icon }} </v-icon>
                  </v-btn>
                </v-list-item-action>
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
  props: {
    bot: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      skills: 'skill/skills'
    }),
    menu() {
      return [
        {
          title: this.bot.status ? 'Pause' : 'Activate',
          icon: this.bot.status ? 'mdi-pause' : 'mdi-play'
        },
        {
          title: 'Analytics',
          icon: 'mdi-google-analytics'
        },
        {
          title: 'Delete',
          icon: 'mdi-delete'
        }
      ]
    },
    referrals() {
      return this.bot.referralsCount || 0
    },
    refPercentage() {
      return this.bot.leadCount && this.bot.referralsCount
        ? Math.floor((this.bot.referralsCount / this.bot.leadCount) * 100)
        : 0
    },
    allLeads() {
      return this.bot.leadCount || 0
    }
  },
  methods: {
    editBot(bot) {
      this.$store.commit('bot/SET_CURRENT_BOT', bot)
      if (bot.status) {
        this.$store.dispatch('bot/pauseBot', { bot, status: false })
      }
      this.$router.push({ name: 'edit-bot-id', params: { id: bot.id } })
    },
    options({ bot, action }) {
      if (action === 'Analytics') {
        this.$store.commit('bot/SET_CURRENT_BOT', bot)
        this.$router.push({ name: 'bot-id', params: { id: bot.id } })
      } else if (action === 'Pause' || action === 'Activate') {
        if (!bot.status) {
          this.$store.dispatch('bot/pauseBot', { bot, status: true })
        } else {
          this.$store.dispatch('bot/pauseBot', { bot, status: false })
        }
      } else if (action === 'Delete') {
        // Open the dialog pop up
        this.$store.commit('app/SET_DELETE_ACTION', this.deleteBot)
        this.$store.commit(
          'app/SET_CONFIRMATION_TEXT',
          'Are you sure you want to delete?'
        )
        this.$store.commit(
          'app/SET_CONFIRMATION_SUB_TEXT',
          'Deleting a bot is a permanent action and cannot be reversed'
        )
        this.$store.commit('app/SET_CONFIRMATION_YES', 'Yes Delete')
        this.$store.commit('app/SET_CONFIRMATION_NO', `No Don't delete`)
        this.$store.commit('app/SET_CONFIRM_DIALOG', true)
      }
    },
    deleteBot() {
      this.$store.dispatch('bot/deleteBot', this.bot)
    }
  }
}
</script>

<style scoped>
.template-title {
  font-family: 'Amiko', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: rgb(186, 197, 212);
}
.template-link {
  font-family: 'Raleway', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #00a2ff;
  text-decoration: underline;
}
</style>
