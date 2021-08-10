<template>
  <!-- The added rewards cards -->
  <div class="mt-8 mb-6">
    <v-card
      v-for="(notification, i) in notifications"
      :key="i"
      flat
      outline
      class="mx-6 mb-0 mt-2"
      color="primary"
    >
      <v-row wrap>
        <v-col xs="2" md="2">
          <!-- <div class="caption grey--text">Status</div> -->
          <div class="mt-4 pl-4">
            <v-icon size="30" color="appBlue">mdi-message-text-outline</v-icon>
          </div>
        </v-col>
        <v-col xs="10" md="6">
          <div class="caption grey--text">Title</div>
          <p class="appBlue--text subtitle-2 pt-4">
            {{ notification.title }}
          </p>
        </v-col>
        <v-col class="px-0" xs="6" md="2">
          <div class="caption grey--text">Image</div>
          <div class="caption appBlue--text font-weight-bold">
            {{ notification.image }}
          </div>
        </v-col>
        <!-- Just taking up an empty space -->
        <v-col class="px-0" xs="6" md="1">
          <div></div>
        </v-col>
        <v-col xs="6" md="1" class="px-0 pl-1">
          <v-menu :nudge-width="50" open-on-hover transition="scale-transition">
            <template v-slot:activator="{ on }">
              <div class="mt-4 pr-0">
                <v-icon ripple color="appBlue" v-on="on">
                  mdi-dots-vertical
                </v-icon>
              </div>
            </template>
            <v-list v-for="action in actions" :key="action.title" link>
              <v-list-item
                link
                nuxt
                @click="
                  menu({
                    act: action.action,
                    notification: notification,
                    i
                  })
                "
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
  props: {
    notifications: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
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
    menu({ notification, act, index }) {
      if (act === 'edit') {
        this.$emit('edit', { notification, index })
      } else if (act === 'delete') {
        const subIndex = index
        this.$store.commit('bot/DELETE_NOTIFICATION_CONTENT', {
          index: this.index,
          subIndex
        })
      }
    }
  }
}
</script>

<style></style>
