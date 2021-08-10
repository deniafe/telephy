<template>
  <v-card color="accent" flat min-height="600">
    <v-row class="pa-4">
      <v-col cols="12" sm="7" md="6">
        <v-form>
          <AppInput label="Search" append-icon="mdi-magnify" />
        </v-form>
      </v-col>
      <v-col cols="12" sm="5" md="6">
        <div class="float-right caption">
          Images from <span class="primary--text">Pixabay</span>
        </div>
      </v-col>
    </v-row>
    <v-row class="pa-4">
      <v-col
        v-for="n in 30"
        :key="n"
        class="d-flex child-flex"
        cols="6"
        sm="4"
        md="3"
      >
        <v-img
          :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
          :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
          aspect-ratio="1"
          class="grey lighten-2"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  methods: {
    async getFreeImages() {
      const res = await this.$axios.$get(
        'https://pixabay.com/api/?key=13215013-5082012e72b3bb6c743270ec1'
      )
      // eslint-disable-next-line no-console
      console.log(res)
    }
  }
}
</script>
