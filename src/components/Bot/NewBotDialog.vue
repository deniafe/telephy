<template>
  <v-dialog
    v-model="botDialog"
    overlay-color="black"
    class="ma-0"
    max-width="400"
  >
    <v-card flat class="pa-4" color="accent">
      <v-card-title>
        <span class="headline">Create New Bot</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="botForm" v-model="valid">
            <AppInput
              v-model="botTitle"
              :rules="botRules"
              :hint="
                'This is the username you choose when you create a bot with botfather e.g @telephybot.'
              "
              label="Bot Username"
            />

            <AppInput
              v-model="botKey"
              :rules="botRules"
              :hint="
                'This is the API token for your bot. You can get this from botfather once you create a bot with botfather.'
              "
              label="Bot Key"
            />
            <v-row class="pa-0">
              <v-col class="pa-2" cols="6">
                <v-menu
                  ref="startMenu"
                  v-model="startMenu"
                  :close-on-content-click="false"
                  :return-value.sync="startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <div>
                      <v-text-field
                        v-model="startDate"
                        style="height: 46px"
                        background-color="background"
                        label="Start Date"
                        prepend-icon="mdi-calendar"
                        :rules="botRules"
                        :hint="'When do you want your bot to start running'"
                        readonly
                        solo
                        flat
                        v-on="on"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker v-model="startDate" light no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="appPink" @click="startMenu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="appBlue"
                      @click="$refs.startMenu.save(startDate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="pa-2" cols="6">
                <v-menu
                  ref="endMenu"
                  v-model="endMenu"
                  :close-on-content-click="false"
                  :return-value.sync="endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <div>
                      <v-text-field
                        v-model="endDate"
                        style="height: 46px"
                        background-color="background"
                        label="End Date"
                        prepend-icon="mdi-calendar"
                        :rules="botRules"
                        :hint="'When do you want your bot to stop running'"
                        readonly
                        solo
                        flat
                        v-on="on"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker v-model="endDate" light no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="appPink" @click="endMenu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="appBlue"
                      @click="$refs.endMenu.save(endDate)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="!creating" color="appPink" text @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="creating"
          :disabled="!valid"
          text
          @click="createBot"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      filled: false,
      botTitle: '',
      botKey: '',
      startDate: '',
      endDate: '',
      startMenu: false,
      endMenu: false,
      modal: false,
      menu2: false,
      valid: false,
      botRules: [
        v => /[^\s]/.test(v) || 'This field is required',
        v => (v && v.length >= 2) || 'Must be more than 2 characters'
      ]
    }
  },
  computed: {
    ...mapGetters({
      dialog: 'bot/dialog',
      user: 'auth/user',
      creating: 'bot/creating'
    }),
    botDialog: {
      get() {
        return this.dialog
      },
      set(val) {
        this.$store.dispatch('bot/setBotDialog', val)
      }
    }
  },
  watch: {
    dialog(newValue) {
      if (!newValue) {
        this.resetForm()
      }
    }
  },
  methods: {
    createBot() {
      const newBot = {
        userId: this.user.id,
        title: this.botTitle,
        key: this.botKey,
        status: false,
        rewards: [],
        contest: {
          template: '',
          settings: {
            winnerSelect: '',
            pointsForReferralsAndSignUps: {},
            pointsForSocialInteractions: {},
            customActions: []
          }
        },
        socialAppearance: [
          {
            name: 'Facebook',
            icon: 'mdi-facebook',
            color: '#3b5998 ',
            title: '',
            content: '',
            image: '',
            status: false
          },
          {
            name: 'Twitter',
            icon: 'mdi-twitter',
            color: ' cyan ',
            title: '',
            content: '',
            image: '',
            status: false
          },
          {
            name: 'Pinterest',
            icon: 'mdi-pinterest',
            color: ' red ',
            title: '',
            content: '',
            image: '',
            status: false
          },
          {
            name: 'WhatsApp',
            icon: 'mdi-whatsapp',
            color: ' green ',
            title: '',
            content: '',
            image: '',
            status: false
          },
          {
            name: 'Telegram',
            icon: 'mdi-telegram',
            color: ' blue ',
            title: '',
            content: '',
            image: '',
            status: false
          },
          {
            name: 'Email',
            icon: 'mdi-email',
            color: ' primary',
            title: '',
            content: '',
            image: '',
            status: false
          }
        ],
        eventsAndNotifications: [
          {
            type:
              'Send notification once someone signs up through their referral link',
            status: false,
            notifications: [
              {
                content: '',
                image: '',
                frequency: 1
              }
            ]
          },
          {
            type: 'Send notification once a reward is unlocked',
            status: false,
            notifications: [
              {
                content: '',
                image: '',
                frequency: 1
              }
            ]
          },
          {
            type: 'Send reminders to participants with 0 points',
            status: false,
            notifications: [
              {
                content: '',
                image: '',
                schedule: 5
              }
            ]
          },
          {
            type:
              'Send reminders to participants with more than 0 of required points',
            status: false,
            notifications: [
              {
                content: '',
                image: '',
                schedule: 5
              }
            ]
          },
          {
            type:
              'Send reminders to participants who have almost the required points',
            status: false,
            notifications: [
              {
                content: '',
                image: '',
                schedule: 5
              }
            ]
          }
        ],
        startDate: firebase.firestore.Timestamp.fromDate(
          new Date(this.startDate)
        ),
        endDate: firebase.firestore.Timestamp.fromDate(new Date(this.endDate))
      }
      this.$store.dispatch('bot/createNewBot', newBot)
    },
    resetForm() {
      this.$refs.botForm.reset()
    },
    closeDialog() {
      this.$store.dispatch('bot/setBotDialog', false)
    }
  }
}
</script>

<style scoped>
#new-bot {
  font-family: 'Raleway', sans-serif;
  font-size: 24px;
  color: #fff;
  text-align: center;
}
#close-group {
  background-color: transparent;
  padding-left: 520px;
}
</style>
