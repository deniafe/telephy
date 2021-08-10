<template>
  <div>
    <v-card color="#150e3a" flat class="mb-12 pr-12" min-height="200px">
      <div style="color: white">
        You can offer rewards to your participants. Participants in your
        campaign will be able to unlock rewards after completing different
        milestones that you set. You can add multiple rewards
      </div>
      <v-row class=" ma-0 mt-10">
        <v-col cols="6">
          <template>
            <v-card color="appAccentBlue" class="mx-auto" max-width="500">
              <v-card-title> Website Button </v-card-title>

              <v-card-subtitle>
                Add a description of your website plus a link to it
              </v-card-subtitle>

              <v-card-actions class="pl-2">
                <v-switch label="Use Default" color="appBlue" inset></v-switch>

                <v-spacer></v-spacer>

                <v-btn icon @click="show = !show">
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text>
                    I'm a thing. But, like most politicians, he promised more
                    than he could deliver. You won't have time for sleeping,
                    soldier, not with all the bed making you'll be doing. Then
                    we'll go with that data file! Hey, you add a one and two
                    zeros to that or we walk! You're going to do his laundry?
                    I've got to find a way to escape.
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </template>
        </v-col>
        <v-col cols="6"></v-col>
      </v-row>
    </v-card>
    <v-btn text color="primary" @click="$emit('continue')">Start Again</v-btn>
    <v-btn text @click="$emit('skip')">Skip this step</v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false
  })
}
</script>

<style scoped>
.theme--dark.v-list {
  background-color: #150e3a;
}
</style>
