<template>
  <v-card>
    <v-navigation-drawer
      v-model="panel"
      color="accent"
      width="350"
      right
      app
      :permanent="rightPanel"
      temporary
    >
      <v-toolbar color="accent" dark flat>
        <v-btn icon>
          <v-icon color="appPink" @click="toggleControl"
            >mdi-window-close</v-icon
          >
        </v-btn>

        <v-toolbar-title v-if="currentActionMenu">{{
          currentActionMenu.title
        }}</v-toolbar-title>

        <v-toolbar-title v-if="currentAction">{{
          currentAction.title
        }}</v-toolbar-title>
      </v-toolbar>
      <v-card flat color="transparent">
        <v-form ref="editorForm" v-model="valid">
          <v-row class="mt-0 pt-1 mx-2 mb-0">
            <v-col v-if="actionMenu" class="py-0 pt-6 pb-4" cols="12">
              <AppSelectInput
                :items="currentActionMenu.items"
                @input="updateSelectType"
              />
            </v-col>

            <v-col v-if="currentActionMenu" class="py-0 pb-4" cols="12">
              <AppSelectInput
                v-if="currentActionMenu && selectType === 'Text Messages'"
                :label="'Dynamic Values'"
                :items="variables"
                :hint="'Use dynamic values to customize messages to your users'"
                @input="addVariable"
              />
              <!-- Send Message Create Actions -->
              <AppTextArea
                v-if="currentActionMenu && selectType === 'Text Messages'"
                :rules="textRules"
                :value="body.text"
                @input="updateText"
                @emoji="addEmoji"
              />

              <div
                v-else-if="currentActionMenu && selectType === 'Images'"
                style="width: 250px; height: 150px"
                class="mx-auto"
              >
                <AppImageUpload
                  :round="true"
                  :value="body"
                  size="120"
                  component="addImageEditor"
                  label="Click to upload Image"
                />
              </div>
              <AppImageUpload
                v-else-if="currentActionMenu && selectType === 'Documents'"
                label="Click to upload a Document"
                :round="true"
                :value="body"
                :size="200"
                type="document"
                component="addDocumentEditor"
              />
            </v-col>

            <v-col v-if="currentAction" class="py-0 pb-4" cols="12">
              <div
                v-if="currentAction && currentAction.title === 'Images'"
                style="width: 250px; height: 150px"
                class="mx-auto"
              >
                <AppImageUpload
                  :round="true"
                  :value="body"
                  size="120"
                  component="editImageEditor"
                />
              </div>
              <AppImageUpload
                v-else-if="currentAction && currentAction.title === 'Documents'"
                :round="true"
                size="200"
                :value="body"
                type="document"
                component="editDocumentEditor"
              />
            </v-col>

            <!-- Show Rewards action -->
            <v-col
              v-if="
                (currentAction && currentAction.title.includes('Reward:')) ||
                  (currentActionMenu &&
                    selectType &&
                    currentActionMenu.title === 'Show Reward')
              "
              class="py-0 pb-4"
              cols="12"
            >
              <v-card color="background">
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div>
                    <v-card-title class="headline">{{
                      currentReward.name
                    }}</v-card-title>

                    <v-card-subtitle>{{ currentReward.type }}</v-card-subtitle>

                    <v-card-actions>
                      <v-btn
                        class="ml-2 mt-3"
                        fab
                        icon
                        height="40px"
                        right
                        width="40px"
                      >
                        <v-icon>mdi-gift-outline</v-icon>
                      </v-btn>

                      <!-- <v-btn class="ml-2 mt-5" outlined rounded small>
                        {{ currentReward.file.name }}
                      </v-btn> -->
                    </v-card-actions>
                  </div>

                  <v-avatar class="ma-3" size="125" tile>
                    <v-img :src="currentReward.image.url"></v-img>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
            <!-- Show Rewards action -->

            <!-- Small buttons to add buttons to text -->
            <v-col
              v-if="currentActionMenu && selectType === 'Text Messages'"
              class="py-0 pb-2"
              cols="6"
            >
              <v-btn text @click="inlineButton = !inlineButton">
                <v-icon color="appBlue">mdi-plus</v-icon>
                <small>{{ buttonText }}</small>
              </v-btn>
            </v-col>
            <v-col
              v-if="currentActionMenu && selectType === 'Text Messages'"
              class="pa-0 ma-0"
              cols="2"
            >
              <v-switch class="ma-0 mt-1" v-model="buttonMode"></v-switch>
            </v-col>
            <v-col
              v-if="currentActionMenu && selectType === 'Text Messages'"
              class="pa-0 ma-0 mt-2"
              cols="4"
            >
              <small>Connect to a skill</small>
            </v-col>
            <!-- For Update Inline Buttons -->
            <v-slide-y-transition>
              <v-col
                v-if="
                  currentActionMenu &&
                    selectType === 'Text Messages' &&
                    inlineButton
                "
                cols="12"
              >
                <AppInput
                  :label="'Enter Button Text'"
                  @input="updateInlineButtonText"
                  @emoji="addButtonEmoji"
                />
                <AppInput
                  v-if="!buttonMode"
                  :label="'Enter Button Url'"
                  @input="updateInlineButtonUrl"
                />
                <AppSelectInput
                  v-if="buttonMode"
                  :items="buttonModes"
                  :label="'Choose a skill'"
                  @input="updateInlineButtonUrl"
                />
              </v-col>
            </v-slide-y-transition>

            <v-col class="py-0 pb-2" cols="12">
              <v-btn
                v-if="currentActionMenu && selectType === 'Text Messages'"
                text
                @click="inlineImage = !inlineImage"
              >
                <v-icon color="appBlue">mdi-plus</v-icon>
                <small>{{ imageButtonText }}</small>
              </v-btn>
            </v-col>
            <v-slide-y-transition>
              <v-col
                v-if="
                  currentActionMenu &&
                    selectType === 'Text Messages' &&
                    inlineImage
                "
                cols="12"
              >
                <AppImageUpload
                  :value="img"
                  :round="true"
                  size="120"
                  :component="'addTextImageEditor'"
                />
              </v-col>
            </v-slide-y-transition>

            <!-- Edit Message Actions Beginning -->
            <v-col
              v-if="currentAction && currentAction.title === 'Text Messages'"
              cols="12"
            >
              <AppSelectInput
                :label="'Dynamic Values'"
                :items="variables"
                :hint="'Use dynamic values to customize messages to your users'"
                @input="addVariable"
              />
              <AppTextArea
                :value="body.text"
                @input="updateText"
                @emoji="addEmoji"
              />
            </v-col>

            <!-- Small buttons to EDIT buttons to text -->
            <v-col class="py-0 pb-2" cols="6">
              <v-btn
                v-if="currentAction && currentAction.title === 'Text Messages'"
                text
                @click="inlineButton = !inlineButton"
              >
                <v-icon color="appBlue">mdi-plus</v-icon>
                <small>{{ buttonText }}</small>
              </v-btn>
            </v-col>
            <v-col
              v-if="currentAction && currentAction.title === 'Text Messages'"
              class="pa-0 ma-0"
              cols="2"
            >
              <v-switch class="ma-0 mt-1" v-model="buttonMode"></v-switch>
            </v-col>
            <v-col
              v-if="currentAction && currentAction.title === 'Text Messages'"
              class="pa-0 ma-0 mt-2"
              cols="4"
            >
              <small>Connect to a skill</small>
            </v-col>
            <!-- For Updating and Editing Inline Buttons -->
            <v-slide-y-transition>
              <v-col
                v-if="
                  currentAction &&
                    currentAction.title === 'Text Messages' &&
                    inlineButton
                "
              >
                <AppInput
                  :value="
                    currentAction.body.button
                      ? currentAction.body.button.text
                      : ''
                  "
                  @input="updateInlineButtonText"
                  @emoji="addButtonEmoji"
                />

                <AppInput
                  v-if="!buttonMode"
                  :value="
                    currentAction.body.button
                      ? currentAction.body.button.url
                      : ''
                  "
                  :label="'Enter Button Text'"
                  @input="updateInlineButtonUrl"
                />
                <AppSelectInput
                  v-if="buttonMode"
                  :value="
                    currentAction.body.button
                      ? currentAction.body.button.url
                      : ''
                  "
                  :items="buttonModes"
                  :label="'Choose a skill'"
                  @input="updateInlineButtonUrl"
                />
              </v-col>
            </v-slide-y-transition>

            <v-col class="py-0 pb-2" cols="12">
              <v-btn
                v-if="currentAction && currentAction.title === 'Text Messages'"
                text
                @click="inlineImage = !inlineImage"
              >
                <v-icon color="appBlue">mdi-plus</v-icon>
                <small>{{ imageButtonText }}</small>
              </v-btn>
            </v-col>
            <v-slide-y-transition>
              <v-col
                v-if="
                  currentAction &&
                    currentAction.title === 'Text Messages' &&
                    inlineImage
                "
                cols="12"
              >
                <AppImageUpload
                  :round="true"
                  size="120"
                  component="editTextImageEditor"
                  :value="img"
                />
              </v-col>
            </v-slide-y-transition>
            <!-- End of edit message actions -->
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="appPink" text @click="closeEditor"> Cancel </v-btn>
          <v-btn
            v-if="actionMenu"
            color="primary"
            :disabled="!valid || !validImage"
            text
            @click="addAction"
          >
            Save
          </v-btn>
          <v-btn
            v-else-if="currentAction"
            color="primary"
            :disabled="!valid || !validImage"
            text
            @click="editAction"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
// import { db } from 'firebase'

export default {
  components: {},
  data() {
    return {
      body: {},
      selectType: null,
      imgUrl: '',
      img: '',
      inlineButton: false,
      inlineImage: false,
      valid: false,
      valid2: false,
      imgl: null,
      buttonMode: false,
      variables: [`ParticipantName`, `ParticipantReferralLink`],
      textRules: [
        v => /[^\s]/.test(v) || 'This field is required',
        v => (v && v.length >= 2) || 'Must be more than 2 characters',
      ],
    }
  },
  computed: {
    ...mapGetters({
      rightPanel: 'action/rightPanel',
      currentSkill: 'skill/currentSkill',
      actionMenu: 'action/currentActionMenu',
      currentAction: 'action/currentAction',
      currentActionImage: 'action/currentActionImage',
      skills: 'skill/skills',
      currentBot: 'bot/currentBot',
    }),
    panel: {
      get() {
        return this.rightPanel
      },
      set(val) {
        this.$store.commit('action/SET_RIGHT_PANEL', val)
      },
    },
    buttonModes() {
      const buttonModes = this.skills.map(skill => skill.title)
      return buttonModes
    },
    buttonText() {
      let text
      if (this.currentAction && this.currentAction.body.button) {
        if (this.inlineButton) {
          text = 'Hide Button'
        } else {
          text = 'Show Button'
        }
      } else {
        text = 'Add Button'
      }
      return text
    },
    imageButtonText() {
      let text
      if (this.currentAction && this.currentAction.body.image) {
        if (this.inlineImage) {
          text = 'Hide Image'
        } else {
          text = 'Show Image'
        }
      } else {
        text = 'Add Image'
      }
      return text
    },
    currentReward() {
      let reward
      let title
      if (this.currentAction && this.currentAction.title.includes('Reward:')) {
        title = this.currentAction.title.replace('Reward: ', '')
        let current = this.currentBot.rewards.filter(reward => {
          if (reward.name === title) {
            return reward
          }
        })
        reward = current[0]
      } else if (
        this.currentActionMenu &&
        this.selectType.includes('Reward: ')
      ) {
        title = this.selectType.replace('Reward: ', '')
        let current = this.currentBot.rewards.filter(reward => {
          if (reward.name === title) {
            return reward
          }
        })
        reward = current[0]
      }
      return reward
    },
    currentActionMenu() {
      let menu = { ...this.actionMenu }

      if (menu.title === 'Show Reward') {
        let rewards = this.currentBot.rewards
        let rewardTitles
        if (rewards) {
          rewardTitles = rewards.map(reward => `Reward: ${reward.name}`)
        } else {
          rewardTitles = ['You have no rewards yet']
        }
        menu.items = rewardTitles
      }
      return menu
    },
    validImage() {
      let result = true
      if (this.selectType === 'Images' && !this.body.url) {
        result = false
      } else {
        result = true
      }
      return result
    },
  },
  watch: {
    rightPanel(newValue) {
      if (newValue === false) {
        this.selectType = null
        this.body = {}
        this.img = ''
        this.buttonMode = false
        // this.imgUrl = ''
        this.inlineButton = false
        this.inlineImage = false
        this.$store.commit('action/SET_CURRENT_ACTION', null)
        this.$store.commit('action/SET_CURRENT_ACTION_MENU', null)
        this.$store.commit('action/SET_CURRENT_ACTION_IMAGE', {})
        // Reset inputs validation
        this.$refs.editorForm.resetValidation()
      }
    },
    currentActionImage(newValue) {
      if (newValue !== null) {
        if (this.inlineImage) {
          this.body.image = this.currentActionImage
          this.img = this.currentActionImage
        } else {
          this.body = this.currentActionImage
        }
      }
    },
    currentAction(newValue) {
      if (newValue) {
        this.body = { ...this.currentAction.body }
        // Check if the current action opened has text and image together
        // And set the image to a temporary value on this component
        if (this.currentAction.body.image) {
          this.img = this.currentAction.body.image
          this.inlineImage = true
        }
        if (this.currentAction.body.button) {
          this.inlineButton = true
          this.buttonMode = this.isUrl(this.currentAction.body.button.url)
        }
      }
    },
    selectType(newValue) {
      if (newValue && newValue === 'Text Messages') {
        this.body = { text: '' }
      }
    },
  },
  methods: {
    toggleControl() {
      this.$store.commit('action/SET_RIGHT_PANEL', false)
    },
    addAction() {
      this.$store.dispatch('action/addAction', {
        selectType: this.selectType,
        body: this.body,
      })
    },
    editAction() {
      const editedAction = { ...this.currentAction }

      editedAction.body = this.body
      this.$store.dispatch('action/editAction', {
        skill: this.currentSkill,
        action: editedAction,
      })
    },
    updateSelectType(select) {
      this.selectType = select
    },
    updateTextType(body) {
      this.body = body
      // this.selectType = 'Text Messages'
    },
    updateText(val) {
      this.body.text = val
    },
    addVariable(val) {
      this.body.text = this.body.text + '{' + val + '}'
    },
    addEmoji(val) {
      this.body.text = this.body.text + val.native
    },
    addButtonEmoji(val) {
      if (this.body.button) {
        console.log('There is a button')
        const newButton = { ...this.body.button }
        newButton.text = newButton.text + val.native
        this.body.button = newButton
      } else {
        console.log('There is no button')
        this.body.button = {
          text: val.native,
        }
      }
    },
    updateInlineButtonText(val) {
      if (this.body.button) {
        const newButton = { ...this.body.button }
        newButton.text = val
        this.body.button = newButton
      } else {
        this.body.button = {
          text: val,
        }
      }
    },
    updateInlineButtonUrl(val) {
      if (this.body.button) {
        const newButton = { ...this.body.button }
        newButton.url = val
        this.body.button = newButton
      } else {
        this.body.button = {
          url: val,
        }
      }
    },
    //     updateInlineImage(val) {
    //       if (this.body.image) {
    //         this.body.image.url = val.url
    //         this.body.image.name = val.name
    //       } else {
    //         this.body.image = {
    //           url: val.url,
    //           name: val.name,
    //         }
    //       }
    //       // this.selectType = 'Text Messages'
    //     },
    updateFileType(body) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imgUrl = fileReader.result
        // this.imgLabel = 'Change Image'
      })
      fileReader.readAsDataURL(body)
      this.body = body
    },
    editFileType(body) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imgUrl = fileReader.result
        // this.imgLabel = 'Change Image'
      })
      fileReader.readAsDataURL(body)
      this.body = body
    },
    editActionType(body) {
      this.body = body
    },
    closeEditor() {
      this.$store.commit('action/SET_RIGHT_PANEL', false)
    },
    isUrl(url) {
      let result = false
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i',
      ) // fragment locator
      const isUrl = url.match(pattern)
      if (isUrl === null) result = true
      return result
    },
  },
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #150e3a;
}

::-webkit-scrollbar-thumb {
  background: #191547;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #191547;
}
</style>
