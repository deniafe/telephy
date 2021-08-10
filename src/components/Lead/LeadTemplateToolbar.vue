<template>
  <v-toolbar flat color="background" class="px-6">
    <v-btn
      v-show="filtered"
      x-small
      :color="filteredColor === 'blue' ? '' : 'grey'"
      text
      @click="filterAll"
      >All Leads</v-btn
    >
    <v-btn
      v-show="filtered"
      x-small
      :color="filteredColor === 'green' ? '' : 'grey'"
      text
      @click="filterWinners"
      >Winners</v-btn
    >
    <v-btn
      v-show="filtered"
      x-small
      :color="filteredColor === 'yellow' ? '' : 'grey'"
      text
      @click="filterWithReferrals"
      >With Referrals</v-btn
    >
    <v-btn
      v-show="filtered"
      x-small
      :color="filteredColor === 'pink' ? '' : 'grey'"
      text
      @click="filterWithoutReferrals"
    >
      Without Referrals
    </v-btn>

    <v-btn v-show="selected" icon @click="showDialog">
      <v-icon size="25" color="appBlue">mdi-email</v-icon>
    </v-btn>

    <v-btn v-show="selected" icon @click="leadsDelete">
      <v-icon size="25" color="appPink">mdi-delete</v-icon>
    </v-btn>

    <v-btn v-show="selected" small text color="appBlue" @click="deselect">
      Deselect All
    </v-btn>

    <v-spacer></v-spacer>

    <v-chip small color="appBlue" class="mr-4" @click.stop="selectAll">
      All Leads
    </v-chip>

    <v-btn icon @click.stop="selectWinners">
      <v-icon v-show="leadColor !== 'green'" size="35" color="appGreen"
        >mdi-checkbox-blank-circle-outline</v-icon
      >
      <v-icon v-show="leadColor === 'green'" size="35" color="appGreen"
        >mdi-checkbox-blank-circle</v-icon
      >
    </v-btn>

    <v-btn icon @click.stop="selectWithReferrals">
      <v-icon v-show="leadColor !== 'yellow'" size="35" color="appYellow"
        >mdi-checkbox-blank-circle-outline</v-icon
      >
      <v-icon v-show="leadColor === 'yellow'" size="35" color="appYellow"
        >mdi-checkbox-blank-circle</v-icon
      >
    </v-btn>

    <v-btn icon @click.stop="selectWithoutReferrals">
      <v-icon v-show="leadColor !== 'pink'" size="35" color="appPink"
        >mdi-checkbox-blank-circle-outline</v-icon
      >
      <v-icon v-show="leadColor === 'pink'" size="35" color="appPink"
        >mdi-checkbox-blank-circle</v-icon
      >
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      leadColor: 'blue',
      filteredColor: 'blue'
    }
  },
  computed: {
    ...mapGetters({
      selectedLeads: 'lead/selectedLeads',
      leads: 'lead/leads',
      filtered: 'lead/filtered'
    }),
    selected() {
      return !!this.selectedLeads.length && !this.filtered
    }
  },
  watch: {
    selectedLeads() {
      if (this.selectedLeads.length < 1) {
        this.leadColor = 'blue'
        this.filteredColor = 'blue'
        this.$store.commit('lead/SET_FILTERED', true)
      }
    }
  },
  methods: {
    selectAll() {
      this.$store.commit('lead/SET_SELECTED_LEADS', [...this.leads])
      if (this.filtered) this.$store.commit('lead/SET_FILTERED', false)

      this.leadColor = 'blue'
    },
    selectWinners() {
      const leads = this.leads.filter(lead => {
        if (lead.refPoints >= 10) return lead
      })
      this.$store.commit('lead/SET_SELECTED_LEADS', leads)
      if (this.filtered) this.$store.commit('lead/SET_FILTERED', false)
      this.leadColor = 'green'
    },
    selectWithReferrals() {
      const leads = this.leads.filter(lead => {
        if (lead.refPoints >= 1) return lead
      })
      this.$store.commit('lead/SET_SELECTED_LEADS', leads)
      if (this.filtered) this.$store.commit('lead/SET_FILTERED', false)
      this.leadColor = 'yellow'
    },
    selectWithoutReferrals() {
      const leads = this.leads.filter(lead => {
        if (lead.refPoints === 0) return lead
      })
      this.$store.commit('lead/SET_SELECTED_LEADS', leads)
      if (this.filtered) this.$store.commit('lead/SET_FILTERED', false)
      this.leadColor = 'pink'
    },
    deselect() {
      this.$store.commit('lead/SET_SELECTED_LEADS', '')
      if (this.filter) this.$store.commit('lead/SET_FILTERED', true)
    },
    filterAll() {
      this.$store.commit('lead/SET_SELECTED_LEADS', [...this.leads])
      if (!this.filtered) this.$store.commit('lead/SET_FILTERED', true)

      this.filteredColor = 'blue'
    },
    filterWinners() {
      const leads = this.leads.filter(lead => {
        if (lead.refPoints >= 10) return lead
      })
      this.$store.commit('lead/SET_SELECTED_LEADS', leads)
      if (!this.filtered) this.$store.commit('lead/SET_FILTERED', true)

      this.filteredColor = 'green'
    },
    filterWithReferrals() {
      const leads = this.leads.filter(lead => {
        if (lead.refPoints >= 1) return lead
      })
      this.$store.commit('lead/SET_SELECTED_LEADS', leads)
      if (!this.filtered) this.$store.commit('lead/SET_FILTERED', true)

      this.filteredColor = 'yellow'
    },
    filterWithoutReferrals() {
      const leads = this.leads.filter(lead => {
        if (lead.refPoints === 0) return lead
      })
      this.$store.commit('lead/SET_SELECTED_LEADS', leads)
      if (!this.filtered) this.$store.commit('lead/SET_FILTERED', true)

      this.filteredColor = 'pink'
    },
    showDialog() {
      this.$store.commit('lead/SET_IS_MULTIPLE', true)
      this.$store.commit('lead/SET_MESSAGE_DIALOG', true)
    },
    leadsDelete() {
      this.$store.commit('app/SET_DELETE_ACTION', this.deleteLeads)
      this.$store.commit('app/SET_DELETE_ITEM', 'Leads')
      this.$store.commit('app/SET_CONFIRM_DIALOG', true)
    },
    deleteLeads() {
      const leads = this.selectedLeads
      for (let i = 0; i < leads.length; i++) {
        this.$store.dispatch('lead/deleteLead', leads[i])
      }
    }
  }
}
</script>

<style scoped>
.tasks {
  font-weight: 300;
  font-family: 'Raleway', sans-serif;
}
</style>
