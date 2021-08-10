<template>
  <div class="pt-4">
    <v-stepper v-model="e5" :style="stepperStyle" vertical class="elevation-0">
      <!-- First step {Contest} -->
      <v-stepper-step :complete="e5 > 1" step="1"
        >Pick a template
        <small
          >First you need to pick a template that suits the type of campaign you
          would like to run</small
        >
      </v-stepper-step>

      <v-stepper-content step="1">
        <Contest @continue="e5 = 2" @skip="e5 = 2" />
      </v-stepper-content>

      <!-- Second step {Reward} -->
      <v-stepper-step :complete="e5 > 2" step="2">
        Add One Or More Rewards
        <small
          >A reward is a neccessary incentive for your viral campaign. A
          campaign can have multiple rewards</small
        >
      </v-stepper-step>

      <v-stepper-content step="2">
        <PickReward @continue="e5 = 3" @skip="e5 = 3" />
      </v-stepper-content>

      <!-- Third step {Custom Actions} -->
      <v-stepper-step :complete="e5 > 3" step="3"
        >Add Bonus Actions
        <small
          >Add bonus actions and reward participants for performing more actions
          than sharing.</small
        ></v-stepper-step
      >

      <v-stepper-content step="3">
        <CustomAction @continue="e5 = 4" @skip="e5 = 4" />
      </v-stepper-content>

      <!-- Fouth step {Social Appearance} -->
      <v-stepper-step :complete="e5 > 4" step="4"
        >Social appearance
        <small
          >This is where you decide how your campaign looks when your
          subscribers share on their various social platforms</small
        >
      </v-stepper-step>
      <v-stepper-content step="4">
        <SocialAppearance @continue="e5 = 5" @skip="e5 = 5" />
      </v-stepper-content>

      <!-- Fifth step {Events and Notifications} -->
      <v-stepper-step :complete="e5 > 5" step="5"
        >Events and Notifications
        <small
          >Send puch notifications when certain events occur. This is also where
          you schedule reminders</small
        >
      </v-stepper-step>
      <v-stepper-content step="5">
        <EventsAndNotifications @continue="e5 = 1" @skip="e5 = 1" />
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
import PickReward from '@/components/BotOptions/PickReward'
import Contest from '@/components/BotOptions/Contest'
import SocialAppearance from '@/components/BotOptions/SocialAppearance'
import EventsAndNotifications from '@/components/BotOptions/EventsAndNotifications'
import CustomAction from '@/components/BotOptions/CustomAction'
// import BotAppearanceSettings from '@/components/BotOptions/BotAppearanceSettings'

export default {
  middleware: 'checkAuth',
  components: {
    PickReward,
    Contest,
    SocialAppearance,
    EventsAndNotifications,
    CustomAction
    // BotAppearanceSettings,
  },
  data() {
    return {
      e5: 1,
      reward: true,
      campaign: {
        title: ''
      }
    }
  },
  computed: {
    stepperStyle() {
      const style = { backgroundColor: '#f5f6fa' }
      if (this.$vuetify.theme.dark) {
        style.backgroundColor = '#150e3a'
      }
      return style
    }
  }
}
</script>
