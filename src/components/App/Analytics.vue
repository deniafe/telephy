<template>
  <v-card flat tile class="pa-sm-12 pb-12 pl-6 mt-n6" color="appDeepBlue">
    <v-container>
      <v-row class="ma-0 ml-sm-12">
        <v-col cols="12" md="6">
          <div id="sub-heading">Leads And Referrals</div>
          <v-row class="ma-0">
            <v-col cols="4" sm="4" md="4">
              <div id="pink" class="analytics">
                {{ leadsWithOutReferrals }} %
                <small>No Referrals</small>
              </div>
            </v-col>
            <v-col cols="4" sm="4" md="4">
              <div id="yellow" class="analytics">
                {{ leadsWithReferrals }} %
                <small>With Referrals</small>
              </div>
            </v-col>
            <v-col cols="4" sm="4" md="4">
              <div id="green" class="analytics">
                {{ winners }} %
                <small>Winners</small>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <div id="sub-heading">Lead's Performance</div>
          <v-row class="ma-0">
            <v-col cols="4" sm="4" md="4">
              <div class="analytics">
                {{ referrals }} %
                <small>Referrals %</small>
              </div>
            </v-col>
            <v-col cols="4" sm="4" md="4">
              <div class="analytics">
                {{ directLeads }} %
                <small>Direct Leads %</small>
              </div>
            </v-col>
            <v-col cols="4" sm="4" md="4">
              <div class="analytics">
                {{ allLeads }}
                <small>All Leads</small>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
    referrals() {
      return this.user && this.user.leadCount
        ? Math.floor((this.user.referralsCount / this.user.leadCount) * 100)
        : 0
    },
    directLeads() {
      return this.user && this.user.leadCount
        ? Math.floor(
            ((this.user.leadCount - this.user.referralsCount) /
              this.user.leadCount) *
              100
          )
        : 0
    },
    allLeads() {
      return this.user ? this.user.leadCount : 0
    },
    leadsWithReferrals() {
      return this.user && this.user.leadCount
        ? Math.floor((this.user.leadWithRefsCount / this.user.leadCount) * 100)
        : 0
    },
    leadsWithOutReferrals() {
      return this.user && this.user.leadCount
        ? Math.floor(
            ((this.user.leadCount - this.user.leadWithRefsCount) /
              this.user.leadCount) *
              100
          )
        : 0
    },
    winners() {
      return 0
    }
  }
}
</script>

<style scoped>
#pink {
  border-left: 5px solid #ff4f5f;
  color: #ff4f5f;
}
#yellow {
  border-left: 5px solid #e3b328;
  color: #e3b328;
}
#green {
  border-left: 5px solid #24d4bf;
  color: #24d4bf;
}

#sub-heading {
  font-family: 'Amiko', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: rgb(186, 197, 212);
  line-height: 1.4;
}
.analytics {
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
}
</style>
