<template>
  <div>
    <v-container>
      <div id="password-reset-title" class="appWhite--text">Reset Password</div>
      <div class="text-center mb-10">
        <small
          >Enter your email below and a password reset link will be sent to
          you</small
        >
      </div>

      <v-card
        flat
        class="mx-auto mb-12"
        color="accent"
        max-width="500"
        height="250"
      >
        <v-card flat class="mx-auto pt-8" color="transparent" max-width="300">
          <v-form ref="resetForm" @submit.prevent="resetPassword">
            <v-row class="mt-6 mb-0">
              <v-col class="py-0 pb-6" cols="12">
                <v-text-field
                  v-model="email"
                  style="height: 46px"
                  background-color="background"
                  :rules="emailRules"
                  label="Email"
                  type="email"
                  solo
                  flat
                ></v-text-field>
              </v-col>
              <v-col>
                <AppButton @click="resetPassword">Reset Password</AppButton>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      timeout: 3000,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  created() {
    this.$store.dispatch('auth/checkAuth', 'reset-pw')
  },
  methods: {
    resetForm() {
      this.$refs.resetForm.reset()
    },
    resetPassword() {
      this.$store.dispatch('auth/resetPassword', this.email)
    }
  }
}
</script>

<style scoped>
#password-reset-title {
  font-size: 24px;
  text-align: center;
  padding-top: 40px;
  padding-bottom: 5px;
}
</style>
