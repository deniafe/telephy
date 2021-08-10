<template>
  <!-- The notification system for users -->
  <v-menu
    v-if="errors.length !== 0"
    v-model="menu"
    :close-on-content-click="false"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="mr-2" text v-bind="attrs" v-on="on">
        <small class="mr-3 appPink--text">App Errors </small>
        <v-icon color="appPink" size="12">mdi-alert-circle-outline</v-icon>
      </v-btn>
    </template>

    <v-card color="accent">
      <v-list color="accent">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle color="appPink"
              >{{ errors.length }} error(s) in your bot</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list color="accent">
        <v-list-item v-for="(error, index) in errors" :key="index">
          <v-list-item-subtitle>
            Error in {{ error.title }}
          </v-list-item-subtitle>
          <v-divider></v-divider>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      errors: 'app/errors'
    })
  }
}
</script>

<style></style>
