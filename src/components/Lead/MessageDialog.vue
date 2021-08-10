<template>
  <v-dialog v-model="push" overlay-color="black" width="700">
    <v-card color="accent">
      <v-card class="mx-auto" width="600" flat color="transparent">
        <v-card-title class="headline pl-0">Edit message Message</v-card-title>
        <v-card-subtitle class="pt-2 primary-grey--text pl-0">
          Send Message to lead
        </v-card-subtitle>
        <v-form ref="messagesForm" v-model="valid">
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
                @emoji="addEmoji"
                :rules="messageContentRules"
                :hint="
                  `Create custom messages that can be sent to users of your bot and participants of your contest`
                "
              />
            </v-col>
          </v-row>

          <v-row class="mt-0">
            <v-col class="pa-0 pt-2 pb-3" cols="3">
              <small class="mt-4">Content Image</small>
            </v-col>
            <v-col class="pa-0 pb-3" cols="7">
              <AppImageUpload
                component="addMessageImage"
                :value="message.image"
                :round="true"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="appPink" text @click="closeDialog"> Close </v-btn>
          <v-btn color="primary" text :disabled="!valid" @click="saveMessage">
            Send Message
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      valid: false,
      message: {
        content: '',
        image: ''
      },
      messageContentRules: [
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
      messageDialog: 'lead/messageDialog',
      currentBot: 'bot/currentBot',
      currentMessageImage: 'lead/currentMessageImage',
      selectedLeads: 'lead/selectedLeads',
      currentLead: 'lead/currentLead',
      isMultiple: 'lead/isMultiple'
    }),
    push: {
      get() {
        return this.messageDialog
      },
      set(val) {
        this.$store.commit('lead/SET_MESSAGE_DIALOG', val)
      }
    }
  },
  watch: {
    // push(newValue) {
    //   if (newValue) {
    //     this.message = { ...this.message }
    //   }
    // },
    messageDialog(newValue) {
      if (!newValue) {
        this.$store.commit('lead/SET_CURRENT_MESSAGE_IMAGE', '')
        this.$store.commit('lead/SET_CURRENT_LEAD', '')
        this.message.content = ''
        if (this.isMultiple) this.$store.commit('lead/SET_IS_MULTIPLE', false)
      }
    },
    currentMessageImage(newValue) {
      if (newValue !== null) this.message.image = this.currentMessageImage
    }
  },
  methods: {
    addVariable(val) {
      // eslint-disable-next-line no-console
      console.log(val)
      this.message.content = this.message.content + '{' + val + '}'
    },
    addEmoji(val) {
      this.message.content = this.message.content + val.native
      console.log(val)
    },
    sendSingleMessage(lead) {
      const messageData = this.parser(lead)
      // eslint-disable-next-line no-console
      console.log(messageData.message)
      const sendMessage = firebase.functions().httpsCallable('sendMessage')
      sendMessage(messageData)
        .then(result => {
          const notification = {
            message: result.data,
            type: 'success'
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
        })
        .catch(error => {
          const notification = {
            message: error,
            type: 'error'
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
        })
    },
    saveMessage() {
      if (this.isMultiple) {
        const leads = this.selectedLeads
        this.sendMultipleMessages(leads)
        this.closeDialog()
      } else {
        this.sendSingleMessage(this.currentLead)
        this.closeDialog()
      }
    },
    sendMultipleMessages(leads) {
      const messageData = leads.map(lead => {
        return this.parser(lead)
      })
      const sendMessages = firebase
        .functions()
        .httpsCallable('sendMultipleMessages')
      sendMessages(messageData)
        .then(result => {
          const notification = {
            message: result.data,
            type: 'success'
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
        })
        .catch(error => {
          const notification = {
            message: error,
            type: 'error'
          }
          this.$store.dispatch('notification/setNotification', notification)
          this.$store.dispatch('notification/showNotification', true)
        })
    },
    parser(lead) {
      const pattern = /\{[a-zA-Z]+\}/g
      const retrieved = this.message.content.match(pattern)

      // Remove the @ symbol fom the bot title
      const botTitle = this.currentBot.title.replace('@', '')

      let correctMessage = this.message.content
      let val

      // let totalPoints
      if (retrieved) {
        for (let i = 0; i < retrieved.length; i++) {
          val = retrieved[i]
          // eslint-disable-next-line no-console
          if (val === '{ParticipantName}') {
            correctMessage = correctMessage.replace(
              '{ParticipantName}',
              lead.firstName + ' ' + lead.lastName
            )
          } else if (val === '{ParticipantTotalPoints}') {
            let totalPoints = 0
            for (const key in lead.socialPoints) {
              // eslint-disable-next-line no-prototype-builtins
              if (lead.socialPoints.hasOwnProperty(key)) {
                totalPoints += Number(lead.socialPoints[key])
              }
            }
            totalPoints += Number(lead.refPoints)
            correctMessage = correctMessage.replace(
              '{ParticipantTotalPoints}',
              totalPoints
            )
          } else if (val === '{ParticipantReferralPoints}') {
            correctMessage = correctMessage.replace(
              '{ParticipantReferralPoints}',
              lead.refPoints
            )
          } else if (val === '{ParticipantEmail}') {
            correctMessage = correctMessage.replace(
              '{ParticipantEmail}',
              lead.email
            )
          } else if (val === '{ParticipantReferralLink}') {
            correctMessage = correctMessage.replace(
              '{ParticipantReferralLink}',
              `https://t.me/${botTitle}?start=${lead.telegramUserId}`
            )
          }
        }
      }

      return {
        message: `${correctMessage} <a href="${this.message.image.url}">&#8205;</a>`,
        image: '',
        botKey: lead.botKey,
        telegramUserId: lead.telegramUserId,
        userName: lead.firstName
      }
    },
    closeDialog() {
      this.$store.commit('lead/SET_MESSAGE_DIALOG', false)
    }
  }
}
</script>
