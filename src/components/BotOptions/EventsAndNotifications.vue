<template>
  <div>
    <v-card color="background" flat class="mb-12 pr-sm-12">
      <div style="margin-bottom: 30px">
        Set notifications for participants in your campaign. Telephy will
        automatically send messages to your subscribers at different times and
        for different events
      </div>
      <v-row class="ma-0">
        <v-col
          v-for="(notification, notificationIndex) in notifications"
          :key="notificationIndex"
          cols="12"
          sm="12"
          md="6"
          class="px-0 px-sm-4"
        >
          <v-card class="mt-2" flat color="transparent" max-width="600">
            <v-card color="accent" class="ml-2 pr-2" max-width="600">
              <!-- The events and notification cards -->
              <v-row class="ma-0">
                <v-col class="pt-5 pl-6" cols="3" sm="2">
                  <v-switch
                    color="appBlue"
                    :input-value="notification.status"
                    :inset="$vuetify.breakpoint.smAndUp"
                    @change="setStatus($event, notificationIndex)"
                  ></v-switch>
                </v-col>
                <v-col cols="8" sm="8">
                  <div class="pt-2">
                    {{ notification.type }}
                  </div>
                </v-col>
                <v-col class="pt-5" cols="12" sm="2">
                  <v-btn
                    text
                    color="appBlue"
                    @click="showDialog({ notificationIndex, notification })"
                  >
                    Edit
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
            <!-- For notifications with a frequency input -->
            <v-card
              v-if="check(notification) === 'frequency'"
              color="appDeepBlue"
              class="ml-2"
            >
              <v-row class="ma-0">
                <v-col cols="12" class="ml-4">
                  <small>Pause Notifications After </small>
                  <v-fade-transition hide-on-leave>
                    <v-chip
                      v-show="editFrequency !== notificationIndex"
                      class="ma-2"
                      small
                      color="appBlue"
                      label
                      text-color="white"
                      @click="editFrequency = notificationIndex"
                    >
                      <v-icon right>mdi-edit</v-icon>
                      {{ notification.notifications[0].frequency }} Messages
                    </v-chip>
                  </v-fade-transition>
                  <v-fade-transition hide-on-leave>
                    <div
                      v-show="editFrequency === notificationIndex"
                      style="display: inline-block; width: 90px; height: 24px"
                      class="ml-2"
                    >
                      <v-text-field
                        :value="notification.notifications[0].frequency"
                        dense
                        type="number"
                        :autofocus="true"
                        background-color="appDeepBlue"
                        color="appBlue"
                        flat
                        :min="1"
                        @input="editFreq"
                        @blur="addFrequency(notificationIndex)"
                        @keyup.enter="addFrequency(notificationIndex)"
                      ></v-text-field>
                    </div>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-card>
            <!-- For notifications with a schedule Input -->
            <v-card
              v-if="check(notification) === 'schedule'"
              color="appDeepBlue"
              class="ml-2"
            >
              <v-row class="ma-0">
                <v-col cols="12" class="ml-4">
                  <small>Send Notifications Every </small>
                  <v-fade-transition hide-on-leave>
                    <v-chip
                      v-show="editSchedule !== notificationIndex"
                      class="ma-2"
                      small
                      color="appBlue"
                      label
                      text-color="white"
                      @click="editSchedule = notificationIndex"
                    >
                      <v-icon right>mdi-edit</v-icon>
                      {{ notification.notifications[0].schedule }} Hour(s)
                    </v-chip>
                  </v-fade-transition>
                  <v-fade-transition hide-on-leave>
                    <div
                      v-show="editSchedule === notificationIndex"
                      style="display: inline-block; width: 90px; height: 24px"
                      class="ml-2"
                    >
                      <v-text-field
                        :value="notification.notifications[0].schedule"
                        dense
                        type="number"
                        :autofocus="true"
                        background-color="appDeepBlue"
                        color="appBlue"
                        flat
                        :min="1"
                        @input="editsched"
                        @blur="addSchedule(notificationIndex)"
                        @keyup.enter="addSchedule(notificationIndex)"
                      ></v-text-field>
                    </div>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-btn text color="primary" @click="$emit('continue')">Continue</v-btn>
    <v-btn text @click="$emit('skip')">Skip this step</v-btn>
    <!-- <v-btn color="primary">Next</v-btn> -->
    <NotificationDialog
      :notification-type="notificationType"
      :notification="notificationMessage"
      :index="index"
    />
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'
import { mapGetters } from 'vuex'

import NotificationDialog from '@/components/SubComponents/NotificationDialog'

export default {
  components: {
    NotificationDialog
  },
  data() {
    return {
      e5: 1,
      index: 0,
      notificationMessage: '',
      notificationType: '',
      editFrequency: 0,
      editSchedule: 0,
      frequency: 1,
      schedule: 1
    }
  },
  computed: {
    ...mapGetters({
      currentBot: 'bot/currentBot'
    }),
    notifications() {
      return this.currentBot.eventsAndNotifications
    }
  },
  methods: {
    showDialog({ notificationIndex, notification }) {
      this.$store.commit('botSetting/SET_PUSH_NOTIFICATION_DIALOG', true)
      this.index = notificationIndex
      // The first item in the array is where the real notification is
      this.notificationMessage = notification.notifications[0]
      this.notificationType = notification.type
    },
    setStatus($event, index) {
      this.$store.commit('bot/SET_PUSH_NOTIFICATION_STATUS', {
        val: $event,
        index
      })
      const botRef = db.collection('bots').doc(this.currentBot.id)
      botRef.update({
        eventsAndNotifications: this.currentBot.eventsAndNotifications
      })
    },
    editFreq(val) {
      this.frequency = val
    },
    editsched(val) {
      this.schedule = val
    },
    addFrequency(index) {
      this.editFrequency = null
      this.$store.commit('bot/SET_PUSH_NOTIFICATION_FREQUENCY', {
        frequency: Number(this.frequency) || 1,
        index
      })
      const botRef = db.collection('bots').doc(this.currentBot.id)
      botRef.update({
        eventsAndNotifications: this.currentBot.eventsAndNotifications
      })
    },
    addSchedule(index) {
      this.editSchedule = null
      this.$store.commit('bot/SET_PUSH_NOTIFICATION_SCHEDULE', {
        schedule: Number(this.schedule) || 1,
        index
      })
      const botRef = db.collection('bots').doc(this.currentBot.id)
      botRef.update({
        eventsAndNotifications: this.currentBot.eventsAndNotifications
      })
    },
    check(notification) {
      let result
      const myObj = notification.notifications[0]
      if ('schedule' in myObj) {
        result = 'schedule'
      } else if ('frequency' in myObj) {
        result = 'frequency'
      }
      return result
    }
  }
}
</script>

<style></style>
