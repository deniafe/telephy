<template>
  <v-container>
    <v-card v-if="leads" flat tile class="pt-8" color="background">
      <!-- <v-row> -->
      <div class="pl-4">
        <LeadToolbar />
      </div>
      <!-- </v-row> -->
      <v-row>
        <v-col class="px-8" cols="12">
          <LeadCard
            v-for="(lead, i) in customLeads"
            :key="i"
            :lead="lead"
            :selected="selectedLeads.includes(lead) && !filtered"
            @selected="selectLead"
          />
          <div
            v-if="leads.length == 0 && !loading"
            class="headline text-center pt-4"
          >
            <div>
              You have no lead(s) yet. Share your bot link to start getting
              leads
            </div>
            <div class="pt-2 text-center caption primary-grey--text">
              It could also be a bad internet connection. Ensure you have a good
              connection to load your bot leads
            </div>
            <div class="mt-6 text-center">
              <v-avatar size="200" to="/">
                <img src="/no_result.svg" alt="" />
              </v-avatar>
            </div>
          </div>
          <div class="text-center">
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="appBlue"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import LeadToolbar from '@/components/Lead/LeadTemplateToolbar'
import LeadCard from '@/components/Lead/LeadCard'
export default {
  components: {
    LeadToolbar,
    LeadCard
  },
  computed: {
    ...mapGetters({
      loading: 'lead/loading',
      leads: 'lead/leads',
      selectedLeads: 'lead/selectedLeads',
      filtered: 'lead/filtered'
    }),
    customLeads() {
      return this.selectedLeads.length && this.filtered
        ? this.selectedLeads
        : this.leads
    }
  },
  methods: {
    selectLead(lead) {
      if (this.filtered) {
        this.$store.commit('lead/SET_FILTERED', false)
        this.$store.commit('lead/SET_SELECTED_LEADS', [])
      }
      const sLeads = this.selectedLeads
      // Check if there are selected leads already
      if (sLeads.length > 0) {
        // Check if this lead is inside selected lead,
        const check = sLeads.filter(el => {
          if (el === lead) return el
        })
        // if it is , remove it
        if (check.length > 0) {
          this.$store.commit('lead/DESELECT_LEAD', lead)
          // If it is not already part of the lead, add it
        } else {
          this.$store.commit('lead/SELECT_LEAD', lead)
        }
        // If there are no selected leads at all, just add to the seleceted leads
      } else {
        this.$store.commit('lead/SELECT_LEAD', lead)
      }
    }
  }
}
</script>

<style scoped>
.theme--dark.v-data-table tbody tr.v-data-table__selected {
  background: red !important;
}
</style>
