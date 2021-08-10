<template>
  <div>
    <v-card color="background" flat class="mb-12 pb-6">
      <div>
        You’ll be able to give extra incentive to your campaign participants for
        doing things that will give your business a boost. These are entirely
        specific to your needs, which is why they’re bonus actions. 🙂
      </div>
      <div class="pt-12">
        <v-row class="ma-0">
          <v-col
            v-for="(action, i) in customActions"
            :key="i"
            cols="12"
            sm="4"
            md="3"
          >
            <v-card
              min-height="120"
              width="240"
              color="accent"
              style="position: relative"
              @mouseover="deleteAction = i"
              @mouseout="deleteAction = ''"
              @click="editAction(action, i)"
            >
              <div class="py-2 text-center" style="font-size: 30px">
                <i :class="action.actionIcon"></i>
              </div>
              <p class="font-weight-bold text-center">
                {{ action.actionTitle }}
              </p>
              <p
                class="text-center caption py-2 background"
                style="width: 70%; margin: 0 auto"
              >
                {{ action.actionPoint }} Points
              </p>

              <!-- Icon to edit this custom action -->
              <div
                v-show="deleteAction === i"
                style="position: absolute; left: 10px; bottom: 5"
              >
                <v-icon small @click="editAction(action, i)">mdi-pencil</v-icon>
              </div>
              <!-- Icon to delete this custom action -->
              <div
                v-show="deleteAction === i"
                style="position: absolute; right: 10px; bottom: 5"
              >
                <v-icon small @click="deleteCustomAction(i)"
                  >mdi-trash-can-outline</v-icon
                >
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <!-- Menu for bonus actions -->
            <!-- @click.stop="customActionPop = true" -->

            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-width="20"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-card
                  id="new-custom-action"
                  flat
                  @click="$emit('click')"
                  v-on="on"
                >
                  <div class="text-center pt-8">
                    <small>Click here to add a custom action</small>
                  </div>
                </v-card>
              </template>
              <!-- This is the header menu dropdown for the custom actions -->
              <v-card color="accent">
                <div class="font-weight-bold pl-4 pb-2 pt-2">User Actions</div>
                <v-divider></v-divider>
              </v-card>
              <!-- This is the body menu dropdown for the custom actions -->
              <v-card flat>
                <v-card
                  v-for="(item, index) in actions"
                  :key="index"
                  color="accent"
                  flat
                  ripple
                  @click.stop="openActionPopUp(item)"
                >
                  <div style="cursor: pointer" class="pa-3">
                    <small class="font-weight-bold">{{ item.title }}</small>
                  </div>
                </v-card>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-btn text color="primary" @click="$emit('continue')">Continue</v-btn>
    <v-btn text @click="$emit('skip')">Skip this step</v-btn>
    <!-- Dialog for custom actions -->
    <v-dialog v-model="customActionPop" max-width="700">
      <v-card color="accent">
        <v-card class="mx-auto" width="600" flat color="transparent">
          <v-card-title class="headline pl-0">
            {{ actionTitle || currentAction.title }}
          </v-card-title>
          <v-form ref="customActionsForm" v-model="valid">
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2 pb-3" cols="3">
                <small class="mt-4">Action Title</small>
              </v-col>
              <v-col class="pa-0 pb-3" cols="9">
                <AppInput
                  v-model="actionTitle"
                  :rules="actionContentRules"
                  label="Follow us on instagram"
                  :hint="'The title of the action button?'"
                  :appendIcon="'mdi-emoticon-cool-outline'"
                  @emoji="addTitleEmoji"
                />
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">Action Description</small>
              </v-col>
              <v-col class="pa-0" cols="9">
                <AppTextArea
                  v-model="actionDescription"
                  :rules="actionContentRules"
                  :hint="
                    `This is the description of the custom action you are creating`
                  "
                  label="Click the follow button"
                  @emoji="addEmoji"
                />
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">Url to complete the action</small>
              </v-col>
              <v-col class="pa-0" cols="9">
                <AppInput
                  v-model="actionUrl"
                  :rules="actionUrlRules"
                  :hint="
                    `This is the complete url of the site participants need to visit to complete the action. e.g https://twitter.com/deniafe`
                  "
                  label="https://twitter.com/deniafe"
                />
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">Confirmation question</small>
              </v-col>
              <v-col class="pa-0" cols="9">
                <AppInput
                  v-model="actionConfirmationQuestion"
                  :rules="actionContentRules"
                  :hint="
                    'Ask them a question before giving out the point e.g What username did you use?'
                  "
                  label="What username did you use"
                  :appendIcon="'mdi-emoticon-cool-outline'"
                  @emoji="addQuestionEmoji"
                />
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="pa-0 pt-2" cols="3">
                <small class="mt-4">Custom action points</small>
              </v-col>
              <v-col class="pa-0" cols="5">
                <AppInput
                  v-model="actionPoint"
                  :rules="actionPointsRules"
                  :hint="
                    'How many points should participants get for performing this action'
                  "
                  type="number"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="appPink" text @click="closeDialog"> Close </v-btn>
            <v-btn
              color="primary"
              :disabled="!valid"
              text
              @click="addCustomAction"
            >
              {{ buttonText }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {},
  data: () => ({
    valid: false,
    actionTitle: '',
    actionDescription: '',
    actionUrl: '',
    actionConfirmationQuestion: '',
    actionIcon: 'fab fa-youtube',
    actionColor: '#1976D2FF',
    actionPoint: 0,
    customActionPop: false,
    deleteAction: false,
    showMenu: false,
    menu: false,
    buttonText: 'Save',
    index: '',
    currentAction: '',
    actionContentRules: [
      v => /[^\s]/.test(v) || 'This field is required',
      v => (v && v.length >= 10) || 'Content too short.'
    ],
    actionUrlRules: [
      v => !!v || 'This field is required.',
      v => {
        const pattern = new RegExp(
          '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
          'i'
        ) // fragment locator
        return pattern.test(v) || 'Must be a valid url'
      }
    ],
    actionPointsRules: [
      v => !!v || 'This field is required',
      v => v >= 1 || 'Point(s) for this action must be more than 0'
    ],
    x: 0,
    y: 0,
    actions: [
      {
        title: 'Subscribe To Our Channel'
      },
      {
        title: 'Join Our Facebook Group'
      },
      {
        title: 'Follow Us On Instagram'
      },
      {
        title: 'Like Our Blog Post'
      },
      {
        title: 'Leave Blog comment'
      }
    ]
  }),
  computed: {
    ...mapGetters({
      currentBot: 'bot/currentBot'
    }),
    customActions() {
      return this.currentBot.contest.settings.customActions
    }
  },
  watch: {
    customActionPop(newValue) {
      if (newValue === false) {
        this.actionTitle = ''
        this.actionDescription = ''
        this.actionUrl = ''
        this.actionConfirmationQuestion = ''
        this.actionIcon = 'fab fa-youtube'
        this.actionColor = '#1976D2FF'
        this.actionPoint = 0
        this.buttonText = 'Save'
        this.index = ''
        this.currentAction = ''
        // Reset inputs validation
        this.$refs.customActionsForm.resetValidation()
      }
    }
  },
  methods: {
    addCustomAction() {
      const customAction = {
        actionTitle: this.actionTitle,
        actionDescription: this.actionDescription,
        actionUrl: this.actionUrl,
        actionConfirmationQuestion: this.actionConfirmationQuestion,
        actionIcon: this.actionIcon,
        actionColor: this.actionColor,
        actionPoint: this.actionPoint
      }
      if (this.buttonText === 'Save') {
        this.$store.commit('bot/ADD_CUSTOM_ACTION', customAction)
      } else if (this.buttonText === 'Edit') {
        this.$store.commit('bot/EDIT_CUSTOM_ACTION', {
          index: this.index,
          action: customAction
        })
      }
      this.$store.dispatch('botSetting/updateCustomAction')
      this.customActionPop = false
    },
    addTitleEmoji(val) {
      this.actionTitle = this.actionTitle + val.native
    },
    addEmoji(val) {
      this.actionDescription = this.actionDescription + val.native
    },
    addQuestionEmoji(val) {
      this.actionConfirmationQuestion =
        this.actionConfirmationQuestion + val.native
    },
    pickColor(color) {
      this.actionColor = color
    },
    pickIcon(icon) {
      this.actionIcon = icon
    },
    editAction(action, i) {
      // Open the custom action pop up
      this.customActionPop = true
      // Set the buttonText to edit instaed of asve
      this.buttonText = 'Edit'
      // Set the index of the action about to be edited
      this.index = i
      // Set the pop up content to be that of the clicked action
      this.actionTitle = action.actionTitle
      this.actionDescription = action.actionDescription
      this.actionUrl = action.actionUrl
      this.actionConfirmationQuestion = action.actionConfirmationQuestion
      this.actionIcon = action.actionIcon
      this.actionColor = action.actionColor
      this.actionPoint = action.actionPoint
    },
    deleteCustomAction(index) {
      this.$store.commit('bot/DELETE_CUSTOM_ACTION', index)
      this.$store.dispatch('botSetting/updateCustomAction')
    },
    openActionPopUp(action) {
      this.customActionPop = true
      this.currentAction = action
      this.actionTitle = action.title
    },
    closeDialog() {
      this.customActionPop = false
    }
  }
}
</script>

<style scoped>
#new-custom-action {
  height: 120px;
  width: 240px;
  background-color: transparent;
  border: dashed 1px #652d86;
}
</style>
