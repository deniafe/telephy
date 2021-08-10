<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card color="accent">
      <v-card-title>
        <span class="headline">User Settings</span>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-container>
          <div class="d-flex justify-center mb-2">
            <AppImageUpload
              component="profile"
              size="100"
              label="Profile Image"
              :value="userImg"
            />
          </div>

          <div class="d-flex justify-center mb-1">
            <div class="text-caption">
              Membership:
              <span class="primary--text">{{
                user ? user.membership.plan : ''
              }}</span>
            </div>
          </div>

          <div class="d-flex justify-center mb-4">
            <v-btn text outlined color="primary" @click="confirmChangePlan"
              >Change Plan</v-btn
            >
          </div>

          <v-form ref="userForm" v-model="valid">
            <AppInput
              :hint="'Your first name'"
              :rules="nameRules"
              :label="'First name'"
              v-model="name.firstName"
            />
            <AppInput
              :hint="'Your last name'"
              :rules="nameRules"
              :label="'Last name'"
              v-model="name.lastName"
            />
            <AppInput
              :hint="'Your email'"
              :rules="emailRules"
              :readonly="true"
              :label="'Email'"
              :value="user ? user.email : ''"
              type="email"
            />
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeDialog"> Close </v-btn>
        <v-btn
          :disabled="!valid"
          color="primary"
          text
          @click="saveUserSettings"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    name: {
      firstName: '',
      lastName: ''
    },
    valid: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    nameRules: [
      v => /[^\s]/.test(v) || 'This field is required',
      v => (v && v.length >= 2) || 'Must be more than 2 characters'
    ]
  }),
  computed: {
    ...mapGetters({
      userDialog: 'user/dialog',
      userImg: 'user/userImg',
      user: 'user/user'
    }),
    dialog: {
      get() {
        return this.userDialog
      },
      set(val) {
        this.$store.commit('user/SET_DIALOG', val)
      }
    }
  },
  watch: {
    user(newValue) {
      if (newValue) {
        this.name.firstName = this.user.firstName
        this.name.lastName = this.user.lastName
      }
    }
  },
  methods: {
    saveUserSettings() {
      this.$store.dispatch('user/editUserSettings', this.name)
      this.$store.commit('user/SET_DIALOG', false)
    },
    resetForm() {
      this.$refs.userForm.reset()
    },
    closeDialog() {
      this.$store.commit('user/SET_DIALOG', false)
      this.resetForm()
    },
    goToCheckout() {
      this.$router.push({ name: 'checkout' })
    },
    confirmChangePlan() {
      // Open the dialog pop up
      this.closeDialog()
      this.$store.commit('app/SET_DELETE_ACTION', this.goToCheckout)
      this.$store.commit(
        'app/SET_CONFIRMATION_TEXT',
        `Want to change your membership?`
      )
      this.$store.commit(
        'app/SET_CONFIRMATION_SUB_TEXT',
        `Want to change your membership?`
      )
      this.$store.commit('app/SET_CONFIRMATION_YES', 'Yes Upgrade')
      this.$store.commit('app/SET_CONFIRMATION_NO', `I'm Not Sure`)
      this.$store.commit('app/SET_CONFIRM_DIALOG', true)
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar-thumb {
  background: #150e3a;
  border-radius: 1px;
}

::-webkit-scrollbar-track {
  background: #191547;
}
</style>
