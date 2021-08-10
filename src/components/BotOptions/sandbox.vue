<template>
  <div>
    <v-expand-transition>
      <div v-show="show === i">
        <v-divider></v-divider>
        <!-- Notification Image -->
        <div style="max-width: 250px" class="mt-2 mx-auto">
          <AppImageUpload
            :val="notification.notifications[0].image.url"
            :name="notification.notifications[0].image.name"
            :settings="true"
            :width="0"
            @input="addImage"
          />
        </div>
        <!-- Notification Message -->
        <div style="max-width: 500px" class="py-4 mt-4 mx-auto">
          <AppTextArea
            :value="notification.notifications[0].content"
            @input="addMessage"
          />
        </div>
        <v-row
          v-if="notification.notifications[0].schedule"
          class="ma-0 py-4 mt-4 mx-12 px-12"
        >
          <v-col class="pa-0 pt-2" cols="2">
            <small class="mt-4"> Send a message every</small>
          </v-col>
          <v-col class="pa-0" cols="2">
            <v-text-field
              :value="notification.notifications[0].schedule"
              background-color="#150e3a"
              solo
              flat
              color="primary"
              type="number"
              style="height: 60px"
              @input="addSchedule"
            />
          </v-col>
          <v-col class="pa-0 pt-2 pl-4" cols="2">
            <small class="mt-4"> hours </small>
          </v-col>
        </v-row>
        <!-- Add Message Button -->
        <div class="text-center">
          <v-btn
            large
            class="ma-2 my-8"
            outlined
            color="white"
            @click.stop="saveMessage(i)"
            ><v-icon left>mdi-content-save-outline</v-icon>SAVE MESSAGE</v-btn
          >
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
