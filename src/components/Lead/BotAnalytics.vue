<template>
  <v-card flat tile class="px-12 pt-12 pb-2" color="background">
    <v-row>
      <v-col v-for="(card, i) in report" :key="i" cols="12" sm="6" md="4">
        <div class="mx-auto pb-8 sub-heading">
          Leads Report In The Last 7 Days
        </div>
        <v-card color="accent" class="mt-4 mx-auto" max-width="400">
          <v-sheet
            class="v-sheet--offset mx-auto"
            :color="card.color"
            elevation="12"
            max-width="calc(100% - 32px)"
          >
            <v-sparkline
              :labels="card.labels"
              :value="card.leads"
              color="white"
              line-width="2"
              padding="16"
            ></v-sparkline>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2">{{ card.title }}</div>
            <div class="subheading font-weight-light grey--text">
              {{ card.subtitle }}
            </div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small> mdi-clock </v-icon>
            <span class="caption grey--text font-weight-light"
              >Last Registered at 12pm</span
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {
      priority: [{}],
      labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
      value: [1, 0, 0, 0, 0, 0, 0]
    }
  },
  computed: {
    ...mapGetters({
      leads: 'lead/leads',
      currentBot: 'bot/currentBot'
    }),
    report() {
      //Function to find the highest point in a given array
      function maxOfArray(array) {
        return Math.max.apply(Math, array)
      }
      // Grab the rewards for this particular bot
      const rewards = this.currentBot.rewards
      const rewardPoints = rewards.map(reward => reward.requiredPoints)
      const highestPoint = maxOfArray(rewardPoints)
      let data = [
        {
          color: 'appPink',
          title: 'No Referrals',
          subtitle: 'Leads with 0 referrals',
          total: 0,
          labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
          leads: [0, 0, 0, 0, 0, 0, 0],
          graph: [
            { day: 'Sun', leads: 0 },
            { day: 'Mon', leads: 0 },
            { day: 'Tues', leads: 0 },
            { day: 'Wed', leads: 0 },
            { day: 'Thurs', leads: 0 },
            { day: 'Fri', leads: 0 },
            { day: 'Sat', leads: 0 }
          ]
        },
        {
          color: 'appYellow',
          title: 'With Referrals',
          subtitle: 'Leads with 1 or more referrals',
          total: 0,
          labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
          leads: [0, 0, 0, 0, 0, 0, 0],
          graph: [
            { day: 'Sun', leads: 0 },
            { day: 'Mon', leads: 0 },
            { day: 'Tues', leads: 0 },
            { day: 'Wed', leads: 0 },
            { day: 'Thurs', leads: 0 },
            { day: 'Fri', leads: 0 },
            { day: 'Sat', leads: 0 }
          ]
        },
        {
          color: 'appGreen',
          title: 'Winners',
          subtitle: 'Leads with the complete number of referrals',
          total: 0,
          labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
          leads: [0, 0, 0, 0, 0, 0, 0],
          graph: [
            { day: 'Sun', leads: 0 },
            { day: 'Mon', leads: 0 },
            { day: 'Tues', leads: 0 },
            { day: 'Wed', leads: 0 },
            { day: 'Thurs', leads: 0 },
            { day: 'Fri', leads: 0 },
            { day: 'Sat', leads: 0 }
          ]
        }
      ]
      this.leads.forEach(lead => {
        if (lead.refPoints === 0) {
          data[0].total += 1
          if (moment(lead.registeredAt).isSame(new Date(), 'week')) {
            let num = moment(lead.registeredAt).day()
            data[0].leads[num] += 1
          }
        } else if (lead.refPoints >= 1 && lead.refPoints < highestPoint) {
          data[1].total += 1
          if (moment(lead.registeredAt).isSame(new Date(), 'week')) {
            let num = moment(lead.registeredAt).day()
            data[1].leads[num] += 1
          }
        } else if (lead.refPoints >= highestPoint) {
          data[2].total += 1
          if (moment(lead.registeredAt).isSame(new Date(), 'week')) {
            let num = moment(lead.registeredAt).day()
            data[2].leads[num] += 1
          }
        }
      })
      return data
    }
  }
}
</script>

<style scoped>
.sub-heading {
  font-family: 'Amiko', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: rgb(186, 197, 212);
  line-height: 1.4;
  max-width: 400px;
}
/* .analytics {
  font-family: 'Lato', sans-serif;
  border-left: 5px solid #00a2ff;
  color: #00a2ff;
  height: 62px;
  font-size: 24px;
  font-weight: 700;
  padding-left: 10px;
  padding-top: 4px;
}
.analytics > small {
  padding-top: 2px;
  display: block;
  font-family: 'Amiko', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: rgb(186, 197, 212);
  line-height: 1.4;
} */

/* Dashboard card */
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
