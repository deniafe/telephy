<template>
  <div>
    <v-card color="background" flat class="mb-12 pr-12">
      <div style="margin-bottom: 30px">
        From here, you can control how your campaign will appear on social media
        after subscribers share their referral link. People will see a certain
        headline, description, and image, and this is where you get to adjust
        how that will look.
      </div>
      <v-row class="ma-0" wrap>
        <v-col
          v-for="(network, i) in socialNetworks"
          :key="i"
          cols="12"
          sm="4"
          md="2"
          class="mt-2 justify-center"
          flat
        >
          <v-btn
            v-if="network.status === false"
            min-width="165"
            height="55"
            x-large
            class="ma-2"
            outlined
            :color="network.color"
            @click.stop="showPop(network, i)"
            ><v-icon :color="network.color" left>{{ network.icon }}</v-icon
            >{{ network.name }}</v-btn
          >
          <v-btn
            v-if="network.status === true"
            min-width="165"
            height="55"
            x-large
            dark
            class="ma-2"
            :color="network.color"
            @click.stop="showEditPop(network, i)"
            @mouseover="showDelete = i"
            @mouseout="showDelete = ''"
            ><v-icon color="white" left>{{ network.icon }}</v-icon
            >{{ network.name }}
            <v-scroll-x-transition>
              <v-icon
                v-show="showDelete === i"
                class="pl-4"
                color="white"
                small
                @click.stop="removeNetwork(i)"
              >
                mdi-close</v-icon
              >
            </v-scroll-x-transition>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-btn text color="primary" @click="$emit('continue')">Continue</v-btn>
    <v-btn text @click="$emit('skip')">Skip this step</v-btn>
    <v-dialog v-model="appearancePop" width="700">
      <v-card color="accent">
        <v-card class="mx-auto" width="600" flat color="transparent">
          <v-card-title class="headline pl-0">{{
            currentNetwork.name
          }}</v-card-title>
          <v-card-subtitle class="pt-2 primary-grey--text pl-0"
            >Customize how your content should look anytime it is shared on
            {{ currentNetwork.name }}</v-card-subtitle
          >
          <v-form ref="socialForm" v-model="valid">
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2 pb-3" cols="3">
                <small class="mt-4">Content Title</small>
              </v-col>
              <v-col class="pa-0 pb-3" cols="7">
                <AppInput
                  v-model="currentSocial.title"
                  :rules="socialContentRules"
                  :label="'Social Content Title'"
                  :hint="
                    `This title will show up on all ${currentNetwork.name} posts`
                  "
                  :appendIcon="'mdi-emoticon-cool-outline'"
                  @emoji="addTitleEmoji"
                />
              </v-col>
            </v-row>

            <v-row class="ma-0">
              <v-col class="pa-0 pt-2 pb-3" cols="3">
                <small class="mt-4">Content Description</small>
              </v-col>
              <v-col class="pa-0 pb-3" cols="7">
                <AppTextArea
                  v-model="currentSocial.content"
                  :rules="socialContentRules"
                  :hint="
                    `This content will show up on all ${currentNetwork.name} posts`
                  "
                  @emoji="addEmoji"
                />
              </v-col>
            </v-row>

            <v-row class="ma-0 mt-4">
              <v-col class="pa-0 pt-2 pb-3" cols="3">
                <small class="mt-4">Content Image</small>
              </v-col>
              <v-col class="pa-0 pb-3" cols="7">
                <AppImageUpload
                  component="addSocialImage"
                  :value="currentSocial.image"
                  :round="true"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="appPink" text @click="closeDialog"> Close </v-btn>
            <v-btn :disabled="!valid" color="primary" text @click="addSocial">
              {{ buttonText }}
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
      valid: false,
      currentNetwork: '',
      showDelete: '',
      buttonText: 'Save',
      currentSocial: {
        title: '',
        content: '',
        image: '',
        index: ''
      },
      socialContentRules: [
        v => /[^\s]/.test(v) || 'This field is required',
        v => (v && v.length >= 10) || 'Content too short.'
      ]
    }
  },
  computed: {
    ...mapGetters({
      socialNetworks: 'bot/socialNetworksAppearance',
      socialAppearancePopUp: 'botSetting/socialAppearancePopUp',
      currentSocialImage: 'botSetting/currentSocialImage',
      currentBot: 'bot/currentBot'
    }),
    appearancePop: {
      get() {
        return this.socialAppearancePopUp
      },
      set(val) {
        this.$store.commit('botSetting/SET_SOCIAL_APPEARANCE_POPUP', val)
      }
    }
  },
  watch: {
    socialAppearancePopUp(newValue) {
      if (newValue === false) {
        this.currentSocial = {
          name: '',
          title: '',
          content: '',
          image: '',
          index: ''
        }
        this.buttonText = 'Save'
        this.index = ''
        // Reset inputs validation
        this.$refs.socialForm.resetValidation()
        this.$store.commit('botSetting/SET_CURRENT_SOCIAL_IMAGE', '')
      }
    },
    currentSocialImage(newValue) {
      if (newValue !== null) this.currentSocial.image = this.currentSocialImage
    }
  },
  methods: {
    showPop(network, index) {
      this.currentNetwork = network
      this.currentSocial.index = index
      this.$store.commit('botSetting/SET_SOCIAL_APPEARANCE_POPUP', true)
    },
    showEditPop(network, index) {
      this.currentSocial = {
        name: network.name,
        title: network.title,
        content: network.content,
        image: network.image,
        index
      }
      this.currentNetwork = network
      this.buttonText = 'Edit'
      this.$store.commit('botSetting/SET_SOCIAL_APPEARANCE_POPUP', true)
    },
    addSocial() {
      this.$store.commit('bot/ADD_SOCIAL_NETWORK', this.currentSocial)
      this.$store.dispatch('botSetting/updateSocialAppearance')
      this.$store.commit('botSetting/SET_SOCIAL_APPEARANCE_POPUP', false)
    },
    addTitleEmoji(val) {
      this.currentSocial.title = this.currentSocial.title + val.native
    },
    addEmoji(val) {
      this.currentSocial.content = this.currentSocial.content + val.native
    },
    removeNetwork(i) {
      this.$store.commit('bot/REMOVE_SOCIAL_NETWORK', i)
      this.$store.dispatch('botSetting/updateSocialAppearance')
    },
    closeDialog() {
      this.$store.commit('botSetting/SET_SOCIAL_APPEARANCE_POPUP', false)
    },
    updateFile(val) {
      this.currentSocial.image = val
    }
  }
}
</script>

<style></style>
