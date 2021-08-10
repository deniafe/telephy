<template>
  <v-dialog v-model="push" overlay-color="black" width="700">
    <v-card color="accent">
      <v-card class="mx-auto" width="600" flat color="transparent">
        <v-card-title class="headline pl-0"
          >Edit Notification Message</v-card-title
        >
        <v-card-subtitle class="pt-2 primary-grey--text pl-0">
          {{ notificationType }}
        </v-card-subtitle>
        <v-form ref="notificationsForm" v-model="valid">
          <v-row>
            <v-col class="pa-0 pt-2 pb-3" cols="3">
              <small class="mt-4">Dynamic Values</small>
            </v-col>
            <v-col class="pa-0 pb-3" cols="7">
              <AppSelectInput
                :label="'Dynamic Values'"
                :items="variables"
                :hint="'Use dynamic values to customize messages to your users'"
                @input="addVariable"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="pa-0 pt-2 pb-3" cols="3">
              <small class="mt-4">Content</small>
            </v-col>
            <v-col class="pa-0 pb-3" cols="7">
              <AppTextArea
                v-model="message.content"
                :rules="notificationContentRules"
                :hint="
                  `Create custom messages that can be sent to users of your bot and participants of your contest`
                "
                @emoji="addEmoji"
              />
            </v-col>
          </v-row>

          <v-row class="mt-0">
            <v-col class="pa-0 pt-2 pb-3" cols="3">
              <small class="mt-4">Content Image</small>
            </v-col>
            <v-col class="pa-0 pb-3" cols="7">
              <AppImageUpload
                component="addNotificationImage"
                :value="message.image"
                :round="true"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="appPink" text @click="closeDialog"> Close </v-btn>
          <v-btn
            color="primary"
            text
            :disabled="!valid"
            @click="saveMessage(index)"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '@/plugins/firebase'
import { mapGetters } from 'vuex'

export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    notification: {
      type: [Object, String],
      default: ''
    },
    notificationType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      valid: false,
      message: {
        content: '',
        image: ''
      },
      notificationContentRules: [
        v => /[^\s]/.test(v) || 'This field is required',
        v => (v && v.length >= 10) || 'Content too short.'
      ],
      variables: [
        `ParticipantName`,
        `ParticipantEmail`,
        `ParticipantReferralLink`,
        `ParticipantReferralPoints`,
        `ParticipantTotalPoints`
      ]
    }
  },
  computed: {
    ...mapGetters({
      pushNotificationDialog: 'botSetting/pushNotificationDialog',
      currentBot: 'bot/currentBot',
      currentNotificationImage: 'botSetting/currentNotificationImage'
    }),
    push: {
      get() {
        return this.pushNotificationDialog
      },
      set(val) {
        this.$store.commit('botSetting/SET_PUSH_NOTIFICATION_DIALOG', val)
      }
    }
  },
  watch: {
    push(newValue) {
      if (newValue) {
        this.message = { ...this.notification }
      }
    },
    pushNotificationDialog(newValue) {
      if (!newValue) {
        this.$store.commit('botSetting/SET_CURRENT_NOTIFICATION_IMAGE', '')
      }
    },
    currentNotificationImage(newValue) {
      if (newValue !== null) this.message.image = this.currentNotificationImage
    }
  },
  methods: {
    addImage(val) {
      this.message.image = val
    },
    addSchedule(val) {
      this.message.schedule = val
    },
    addVariable(val) {
      // eslint-disable-next-line no-console
      console.log(val)
      this.message.content = this.message.content + '{' + val + '}'
    },
    addEmoji(val) {
      this.message.content = this.message.content + val.native
    },
    saveMessage(index) {
      this.$store.commit('bot/ADD_NOTIFICATION_CONTENT', {
        content: this.message.content,
        image: this.message.image,
        index
      })
      const botRef = db.collection('bots').doc(this.currentBot.id)
      botRef
        .update({
          eventsAndNotifications: this.currentBot.eventsAndNotifications
        })
        .then(() => {
          this.$store.commit('botSetting/SET_PUSH_NOTIFICATION_DIALOG', false)
        })
    },
    closeDialog() {
      this.$store.commit('botSetting/SET_PUSH_NOTIFICATION_DIALOG', false)
    }
  }
}
</script>

<style>
#messageHeader {
  font-family: 'Raleway', sans-serif;
  font-size: 24px;
  text-align: center;
  padding-top: 15px;
}
</style>
