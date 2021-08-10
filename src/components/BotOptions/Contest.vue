<template>
  <div>
    <v-card color="background" flat class="mb-12 pr-sm-12">
      <div>
        Do you want to run a contest alongside your campaign to boost your lead
        generation? Pick a template below. Give a limited amount of participants
        a chance to win prizes. This will increase amount of shares and leads
        you can get. You can also run your campaign as a contest alone.
      </div>
      <v-row class="ma-0" wrap>
        <v-col
          v-for="(template, i) in templates"
          :key="i"
          cols="12"
          sm="6"
          md="4"
        >
          <template>
            <v-card color="accent" class="mx-auto" max-width="500">
              <v-card-title>
                {{ template.title }}
              </v-card-title>

              <v-card-subtitle>
                Add a description of your website plus a link to it
              </v-card-subtitle>

              <v-card-actions>
                <v-switch
                  :input-value="template.title === currentTemplate"
                  color="appBlue"
                  :inset="$vuetify.breakpoint.smAndUp"
                  @change="pickTemplate($event, template)"
                ></v-switch>
                <v-btn
                  v-if="template.title !== currentTemplate"
                  :color="templateButton(template)"
                  text
                  :small="$vuetify.breakpoint.xs"
                  @click.stop="pickTemplate(true, template)"
                  >{{
                    $vuetify.breakpoint.xs ? 'Select' : 'Select This Template'
                  }}</v-btn
                >
                <v-btn
                  v-if="template.title === currentTemplate"
                  :color="templateButton(template)"
                  small
                  @click.stop="pickTemplate(true, template)"
                  >{{
                    $vuetify.breakpoint.xs ? 'Select' : 'Select This Template'
                  }}</v-btn
                >

                <v-spacer></v-spacer>

                <v-btn icon @click="showTemp(template)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show === template">
                  <v-divider></v-divider>

                  <v-card-text>
                    {{ template.text }}
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-card>
    <v-btn text color="primary" @click="$emit('continue')">Continue</v-btn>
    <v-btn text @click="$emit('skip')">Skip this step</v-btn>
    <v-dialog v-model="contestPopUp" max-width="700">
      <v-card color="accent">
        <v-card class="mx-auto" width="600" flat color="transparent">
          <v-card-title class="headline pl-0">CONTEST SETTINGS</v-card-title>
          <v-form ref="templateForm" v-model="valid">
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2" cols="4">
                <small class="mt-4"
                  >How would you like to select the winners</small
                >
              </v-col>
              <v-col class="pa-0" cols="5">
                <AppSelectInput
                  v-model="contest.winnerSelect"
                  :label="'Dynamic Values'"
                  :items="selectWinnerMethods"
                  :hint="
                    'Tell us if you want us to be the one to pick your winners or if you will do that yourself'
                  "
                />
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="px-0" cols="12">
                <div class="sub-title">Points for referrals and signups</div>
                <div>
                  <small
                    >Specify what actions you want to reward and how many points
                    to give for each action</small
                  >
                </div>
              </v-col>
            </v-row>

            <v-row
              class="ma-0"
              v-for="(el, index) in contest.refAndSignUpPoints"
              :key="index"
            >
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">{{ el.name }}</small>
              </v-col>
              <v-col class="pa-0" cols="5">
                <AppInput
                  v-model="el.point"
                  :rules="pointsRules"
                  :hint="el.hint"
                  type="number"
                />
              </v-col>
            </v-row>

            <div v-if="contest.template !== 'Referral Program'">
              <v-row class="ma-0">
                <v-col class="px-0" cols="12">
                  <div class="sub-title">Points for social interactions</div>
                  <div>
                    <small
                      >Specify how many points you will reward contestants for
                      sharing via share buttons. These points will be awarded
                      just once for each network</small
                    >
                  </div>
                </v-col>
              </v-row>

              <v-row
                class="ma-0"
                v-for="(e, i) in contest.socialPoints"
                :key="i"
              >
                <v-col class="pa-0 pt-2" cols="3">
                  <small class="mt-4">{{ e.name }}</small>
                </v-col>
                <v-col class="pa-0" cols="5">
                  <AppInput
                    v-model="e.point"
                    :rules="pointsRules"
                    :hint="e.hint"
                    type="number"
                  />
                </v-col>
              </v-row>
            </div>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="appPink" text @click="closeDialog"> Close </v-btn>
            <v-btn color="primary" text :disabled="!valid" @click="setContest">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      e6: 1,
      show: false,
      contestPopUp: false,
      valid: false,
      pointsRules: [
        v => v >= 0 || 'Required points must not be a negative number'
      ],
      templates: [
        {
          title: 'Viral Contest / Giveaway',
          subtitle: 'For most brands, this is a good starting point.',
          text:
            'Run a basic viral contest / giveaway for social media & email growth. Contains refer-a-friend & social media bonus actions. Great for capturing more leads & growing your audience. For most brands, this is a good starting point.'
        },
        {
          title: 'Referral Program',
          subtitle: 'For most brands, this is a good starting point.',
          text:
            'Run a referral / ambassador program for your brand. Allow your fans / customers to earn points for referring other people to your brand.'
        },
        {
          title: 'Milestone Contest',
          subtitle: 'For most brands, this is a good starting point.',
          text:
            'A viral contest that allows you to deliver rewards based on point milestones. Great for getting more engagement out of your customers and rewarding them based on how engaged they are with your brand.'
        },
        {
          title: 'Pre-Launch / Waitlist',
          subtitle: 'For most brands, this is a good starting point.',
          text:
            'Supercharge your early-access / pre-launch! This campaign is the perfect way to drum up hype for your next product launch. The higher the user climbs on your list by getting points, the more benefits he receives.'
        },
        {
          title: 'Leaderboard',
          subtitle: 'For most brands, this is a good starting point.',
          text:
            'Get your contestants to climb the leaderboard to unlock rewards (discounts, free products, and prizes)!'
        }
      ],
      selectWinnerMethods: ['Automatic', 'Manual'],
      contest: {
        template: '',
        requiredPoints: 10,
        eachRefPoint: 1,
        winnerSelect: 'Automatic',
        refAndSignUpPoints: {
          visitor: {
            name: 'Points for normal signup',
            point: 0,
            hint: 'Would you like to give points when new users sign up?'
          },
          referral: {
            name: 'Points for referral signup',
            point: 1,
            hint: 'How many points should be awarded a user for each referral'
          }
        },
        socialPoints: {
          facebook: {
            name: 'Points for facebook share',
            point: 1,
            hint:
              'Award points when participants share on facebook. This point is awarded upon clicking on the share button'
          },
          twitter: {
            name: 'Points for twitter share',
            point: 1,
            hint:
              'Award points when participants share on twitter. This point is awarded upon clicking on the share button'
          },
          google: {
            name: 'Points for google share',
            point: 1,
            hint:
              'Award points when participants share on google. This point is awarded upon clicking on the share button'
          },
          linkedIn: {
            name: 'Points for linkedIn share',
            point: 1,
            hint:
              'Award points when participants share on linkdIn. This point is awarded upon clicking on the share button'
          },
          telegram: {
            name: 'Points for telgram share',
            point: 1,
            hint:
              'Award points when participants share on telegram. This point is awarded upon clicking on the share button'
          },
          whatsapp: {
            name: 'Points for whatsapp share',
            point: 1,
            hint:
              'Award points when participants share on whatsapp. This point is awarded upon clicking on the share button'
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      currentTemplate: 'bot/currentTemplate',
      currentBot: 'bot/currentBot'
    })
  },
  watch: {
    contestPopUp(newValue) {
      if (newValue === false) {
        // Reset the popup fields everytime the pop up is closed
        this.clearInputs()
        // Reset inputs validation
        this.$refs.templateForm.resetValidation()
      }
    }
  },
  methods: {
    viewCampaignExample() {},
    // Set the contest in the store
    structureContest() {
      const contest = {
        template: this.contest.template,
        winnerSelect: this.contest.winnerSelect,
        pointsForReferralsAndSignUps: {
          signups: Number(this.contest.refAndSignUpPoints.visitor.point),
          referrals: Number(this.contest.refAndSignUpPoints.referral.point)
        },
        pointsForSocialInteractions: {
          facebook: Number(this.contest.socialPoints.facebook.point),
          twitter: Number(this.contest.socialPoints.twitter.point),
          google: Number(this.contest.socialPoints.google.point),
          linkedIn: Number(this.contest.socialPoints.linkedIn.point),
          telegram: Number(this.contest.socialPoints.telegram.point),
          whatsapp: Number(this.contest.socialPoints.whatsapp.point)
        }
      }
      return contest
    },
    setContest() {
      const contest = this.structureContest()
      // this.$store.commit('bot/SET_CONTEST', contest)
      this.$store.dispatch('botSetting/setContest', contest)
      // Reset and close the pop up once the contest settings have been saved
      this.clearInputs()
      this.contestPopUp = false
    },
    pickTemplate(status, template) {
      if (status) {
        this.contest.template = template.title
        this.contestPopUp = true
        // If template has already been picked, prefill the inputs with the template options
        if (template.title === this.currentTemplate) {
          const contest = this.currentBot.contest.settings
          const refs = this.currentBot.contest.settings
            .pointsForReferralsAndSignUps
          const socials = this.currentBot.contest.settings
            .pointsForSocialInteractions
          this.contest = {
            template: template.title,
            requiredPoints: contest.requiredPoints,
            eachRefPoint: this.currentTemplate.eachRefPoint,
            winnerSelect: contest.winnerSelect,
            refAndSignUpPoints: {
              visitor: {
                name: 'Points for normal signup',
                point: refs.signups
              },
              referral: {
                name: 'Points for referral signup',
                point: refs.referrals
              }
            },
            socialPoints: {
              facebook: {
                name: 'Points for facebook share',
                point: socials.facebook
              },
              twitter: {
                name: 'Points for twitter share',
                point: socials.twitter
              },
              google: {
                name: 'Points for google share',
                point: socials.google
              },
              linkedIn: {
                name: 'Points for linkedIn share',
                point: socials.linkedIn
              },
              telegram: {
                name: 'Points for telgram share',
                point: socials.telegram
              },
              whatsapp: {
                name: 'Points for whatsapp share',
                point: socials.whatsapp
              }
            }
          }
        }
      } else {
        this.clearInputs()
        const contest = this.structureContest()
        // this.$store.commit('bot/SET_CONTEST', this.contest)
        this.$store.dispatch('botSetting/setContest', contest)
      }
    },
    clearInputs() {
      this.contest = {
        template: '',
        requiredPoints: 10,
        eachRefPoint: 1,
        winnerSelect: 'Automatic',
        refAndSignUpPoints: {
          visitor: { name: 'Points for normal signup', point: 0 },
          referral: { name: 'Points for referral signup', point: 1 }
        },
        socialPoints: {
          facebook: { name: 'Points for facebook share', point: 1 },
          twitter: { name: 'Points for twitter share', point: 1 },
          google: { name: 'Points for google share', point: 1 },
          linkedIn: { name: 'Points for linkedIn share', point: 1 },
          telegram: { name: 'Points for telgram share', point: 1 },
          whatsapp: { name: 'Points for whatsapp share', point: 1 }
        }
      }
    },
    templateColor(template) {
      return template.title === this.currentTemplate
        ? 'appBlue'
        : 'appAccentBlue'
    },
    templateButton(template) {
      return template.title === this.currentTemplate ? 'appBlue' : 'appBlue'
    },
    templateText(template) {
      return template.title === this.currentTemplate
    },
    showTemp(template) {
      if (this.show === template) {
        this.show = ''
      } else {
        this.show = template
      }
    },
    closeDialog() {
      this.contestPopUp = false
    }
  }
}
</script>

<style scoped>
.theme--dark.v-list {
  background-color: #150e3a;
  color: #ffffff;
}
::-webkit-scrollbar-track {
  background: #191547;
}
::-webkit-scrollbar-thumb {
  background: #150e3a;
  border-radius: 1px;
}
</style>
