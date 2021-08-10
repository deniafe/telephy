<template>
  <v-container>
    <div id="signup-title" class="appWhite--text">{{ formState }}</div>
    <v-card flat class="mx-auto mb-12" color="accent" max-width="500">
      <v-card flat class="mx-auto pt-8" color="transparent" max-width="300">
        <v-form ref="authForm" @submit.prevent="userAuth">
          <v-row class="mt-6 mb-0">
            <v-col class="py-0 pb-6" cols="12">
              <v-text-field
                v-model="form.email"
                style="height: 46px"
                background-color="background"
                :rules="emailRules"
                label="Email"
                type="email"
                solo
                flat
              ></v-text-field>
            </v-col>
            <v-col class="py-0 pb-6" cols="12">
              <v-text-field
                v-model="form.password"
                style="height: 46px"
                background-color="background"
                :rules="passwordRules"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="
                  showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                "
                solo
                flat
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-btn
                v-if="formState === 'Log In'"
                class="appBlue--text float-right mt-2"
                x-small
                text
                @click="$router.push({ name: 'reset-pw' })"
              >
                Forgot Password?
              </v-btn>
            </v-col>
            <v-col>
              <AppButton @click="userAuth">{{ formState }}</AppButton>
            </v-col>
            <v-col class="px-auto" cols="12">
              <div class="text-center">
                <small>{{
                  formState === 'Sign Up'
                    ? 'Already have an account?'
                    : 'Not a member yet?'
                }}</small>
              </div>
            </v-col>
            <v-col cols="12" class="mb-6">
              <div
                style="text-decoration: underline; cursor: pointer"
                class="text-center"
                @click="changeFormState"
              >
                {{ formState === 'Sign Up' ? 'Log In' : 'Sign Up' }}
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      formState: 'Log In',
      showPassword: false,
      form: {
        email: '',
        password: ''
      },
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => /[^\s]/.test(v) || 'Password is required',
        v => (v && v.length >= 6) || 'Must be 6 characters or more'
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      loading: 'auth/loading'
    })
  },
  mounted() {
    this.$store.dispatch('auth/checkAuth', 'auth')
  },
  methods: {
    userAuth() {
      if (this.$refs.authForm.validate()) {
        this.form.state = this.formState
        this.$store.dispatch('auth/userAuth', this.form)
      } else {
        const notification = {
          message: `Please complete the form to ${this.formState}`,
          type: 'error'
        }
        this.$store.dispatch('notification/setNotification', notification)
        this.$store.dispatch('notification/showNotification', true)
      }
    },
    resetForm() {
      this.$refs.authForm.reset()
    },
    changeFormState() {
      this.formState === 'Sign Up'
        ? (this.formState = 'Log In')
        : (this.formState = 'Sign Up')
      this.resetForm()
    }
  }
}
</script>

<style scoped>
#signup-title {
  font-size: 24px;
  text-align: center;
  padding-top: 40px;
  padding-bottom: 30px;
}
</style>
