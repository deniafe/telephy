<template>
  <div>
    <v-card color="accent" class="mb-2">
      <v-row class="pl-4 pr-4 ma-0">
        <v-col class="pr-0 pt-4 pl-8" md="1">
          <v-btn icon @click.stop="selectLead(lead)">
            <v-icon v-show="!selected" size="30" color="appPink"
              >mdi-checkbox-blank-circle-outline</v-icon
            >
            <v-icon v-show="selected" size="30" color="appPink"
              >mdi-check-circle</v-icon
            >
          </v-btn>
        </v-col>
        <v-col class="pt-6" md="3">
          <div class="template-title">
            {{ lead.firstName }} {{ lead.lastName }}
          </div>
        </v-col>
        <v-col class="pt-5" md="2">
          <div class="template-link">denitest@test.com</div>
        </v-col>
        <v-col class="pt-5" md="2">
          <small class="appBlue--text">{{ lead.refPoints }} Referrals</small>
        </v-col>
        <v-col class="pt-5" md="2">
          <small>Referred By : </small>
          <small class="appBlue--text">{{ lead.referredBy }}</small>
        </v-col>
        <v-col md="1" class="px-0 pt-5 pl-12">
          <v-btn icon @click="showDialog">
            <v-icon color="appBlue">mdi-email</v-icon>
          </v-btn>
        </v-col>
        <v-col md="1" class="px-0 pt-5 pl-5">
          <v-btn icon @click="leadDelete">
            <v-icon color="appPink">mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <!-- <NotificationDialog
      :notification-type="'Send message to the lead'"
      :notification="notificationMessage"
      :index="0"
      :is-lead-message="true"
    /> -->
  </div>
</template>

<script>
// import NotificationDialog from '@/components/SubComponents/NotificationDialog'
export default {
  components: {
    // NotificationDialog,
  },
  props: {
    lead: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      notificationMessage: 'Hi everyone!'
    }
  },
  methods: {
    showDialog() {
      this.$store.commit('lead/SET_CURRENT_LEAD', this.lead)
      this.$store.commit('lead/SET_MESSAGE_DIALOG', true)
    },
    leadDelete() {
      this.$store.commit('app/SET_DELETE_ACTION', this.deleteLead)
      this.$store.commit(
        'app/SET_CONFIRMATION_TEXT',
        'Are you sure you want to delete?'
      )
      this.$store.commit(
        'app/SET_CONFIRMATION_SUB_TEXT',
        'Deleting a lead is a permanent action and cannot be reversed'
      )
      this.$store.commit('app/SET_CONFIRMATION_YES', 'Yes Delete')
      this.$store.commit('app/SET_CONFIRMATION_NO', `No Don't delete`)
      this.$store.commit('app/SET_CONFIRM_DIALOG', true)
    },
    selectLead(lead) {
      this.$emit('selected', lead)
    },
    deleteLead() {
      this.$store.dispatch('lead/deleteLead', this.lead)
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
