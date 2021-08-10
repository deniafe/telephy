<template>
  <div>
    <v-card color="background" flat class="mb-12 pr-sm-12" min-height="200px">
      <div>
        You can offer rewards to your participants. Participants in your
        campaign will be able to unlock rewards after completing different
        milestones that you set. You can add multiple rewards
      </div>
      <RewardCard @edit="editReward" />
      <!-- Add Reward Button -->
      <div class="text-center">
        <v-btn
          color="primary"
          :x-large="$vuetify.breakpoint.smAndUp"
          class="ma-2"
          outlined
          @click.stop="rewardPopUp = true"
          ><v-icon left>mdi-plus</v-icon>ADD A REWARD</v-btn
        >
      </div>
    </v-card>
    <v-btn text color="primary" @click="$emit('continue')">Continue</v-btn>
    <v-btn text @click="$emit('skip')">Skip this step</v-btn>
    <!-- The pop up for rewards -->
    <v-dialog v-model="rewardPopUp" max-width="700">
      <v-card color="accent ">
        <v-card class="mx-auto" width="600" flat color="transparent">
          <v-card-title class="headline pl-0">Add A Reward</v-card-title>
          <v-form ref="rewardForm" v-model="valid">
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">Reward Name</small>
              </v-col>
              <v-col class="pa-0" cols="7">
                <AppInput
                  v-model="currentReward.name"
                  :rules="rewardRules"
                  :hint="
                    'This is the title of your reward. Come with a really catchy name. You can as many rewards as you want for your contest'
                  "
                  label="Add Reward"
                  :appendIcon="'mdi-emoticon-cool-outline'"
                  @emoji="addEmoji"
                />
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="pa-0" cols="3">
                <small class="mt-4">Required Points</small>
              </v-col>
              <v-col class="pa-0" cols="5">
                <AppInput
                  v-model="currentReward.requiredPoints"
                  :rules="rewardPointsRules"
                  :hint="
                    'This is the number of points participants of your contest are required to acquire before they can have access to this reward'
                  "
                  type="number"
                />
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">Reward Type</small>
              </v-col>
              <v-col class="pa-0" cols="5">
                <v-select
                  v-model="currentReward.type"
                  background-color="background"
                  :hint="
                    'Should we handle the delivery of this reward to winners automatically? Or will you do it yourself manually?'
                  "
                  solo
                  flat
                  :items="types"
                />
              </v-col>
            </v-row>
            <v-row
              class="ma-0"
              v-if="currentReward.type === 'Automatic / Digital'"
            >
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">Upload Reward</small>
              </v-col>
              <v-col class="pa-0 pb-2" cols="5">
                <AppImageUpload
                  :value="currentReward.file"
                  label="Click to upload the reward file"
                  :round="true"
                  type="document"
                  component="addRewardFile"
                />
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">Upload Reward Image</small>
              </v-col>
              <v-col class="pa-0 pb-2" cols="5">
                <AppImageUpload
                  :round="true"
                  size="120"
                  component="addRewardImage"
                  label="Click to upload reward Image"
                  :value="currentReward.image"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="appPink" text @click="closeDialog"> Close </v-btn>
            <v-btn color="primary" text :disabled="!valid" @click="addReward">
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
import RewardCard from '@/components/SubComponents/RewardCard'

export default {
  components: {
    RewardCard
  },
  data() {
    return {
      e6: 1,
      rewardPopUp: false,
      name: 'Testing test',
      buttonText: 'Save',
      valid: false,
      rewardRules: [
        v => /[^\s]/.test(v) || 'This field is required',
        v => (v && v.length >= 2) || 'Must be more than 2 characters'
      ],
      rewardPointsRules: [
        v => !!v || 'This field is required',
        v => v >= 1 || 'Required points for this reward must be more than 0'
      ],
      currentReward: {
        name: '',
        requiredPoints: 10,
        type: 'Automatic / Digital',
        file: '',
        image: ''
      },
      types: [
        'Automatic / Digital',
        'Manual / Physical',
        'Private Group / Channel'
      ]
    }
  },
  computed: {
    ...mapGetters({
      currentBot: 'bot/currentBot',
      index: 'botSetting/currentRewardIndex',
      currentRewardImage: 'botSetting/currentRewardImage',
      currentRewardFile: 'botSetting/currentRewardFile'
    })
  },
  watch: {
    rewardPopUp(newValue) {
      if (newValue === false) {
        this.currentReward = {
          name: '',
          requiredPoints: 10,
          type: 'Automatic / Digital',
          file: '',
          image: ''
        }
        this.buttonText = 'Save'
        this.$store.commit('botSetting/SET_CURRENT_REWARD_INDEX', null)
        this.$store.commit('botSetting/SET_CURRENT_REWARD_IMAGE', '')
        this.$store.commit('botSetting/SET_CURRENT_REWARD_FILE', '')
        // Reset inputs validation
        this.$refs.rewardForm.resetValidation()
      }
    },
    currentRewardImage(newValue) {
      if (newValue !== null) this.currentReward.image = this.currentRewardImage
    },
    currentRewardFile(newValue) {
      if (newValue !== null) this.currentReward.file = this.currentRewardFile
    }
  },
  methods: {
    addEmoji(val) {
      this.currentReward.name = this.currentReward.name + val.native
    },
    addReward() {
      if (
        this.currentReward.type === 'Automatic / Digital' &&
        !this.currentReward.file
      ) {
        // Handle any errors
        const notification = {
          message: 'There is no reward uploaded yet',
          type: 'error'
        }
        this.$store.dispatch('notification/setNotification', notification)
        this.$store.dispatch('notification/showNotification', true)
        return
      }
      if (this.buttonText === 'Save') {
        this.$store.dispatch('botSetting/addReward', this.currentReward)
      } else if (this.buttonText === 'Edit') {
        this.$store.commit('bot/EDIT_REWARD', {
          reward: this.currentReward,
          index: this.index
        })
        // The update reward action works for editing and deleting the rewards
        this.$store.dispatch('botSetting/updateReward')
      }

      this.currentReward = {
        name: '',
        requiredPoints: 10,
        type: 'Automatic / Digital',
        file: '',
        image: ''
      }
      this.buttonText = 'Save'
      this.$store.commit('botSetting/SET_CURRENT_REWARD_INDEX', null)
      this.$store.commit('botSetting/SET_CURRENT_REWARD_IMAGE', '')
      this.$store.commit('botSetting/SET_CURRENT_REWARD_FILE', '')
      this.rewardPopUp = false
    },
    editReward({ reward, index }) {
      this.currentReward = { ...reward }
      this.buttonText = 'Edit'
      this.$store.commit('botSetting/SET_CURRENT_REWARD_INDEX', index)
      this.rewardPopUp = true
    },
    closeDialog() {
      this.rewardPopUp = false
    }
  }
}
</script>

<style scoped>
.theme--dark.v-list {
  background-color: #150e3a;
}
</style>
