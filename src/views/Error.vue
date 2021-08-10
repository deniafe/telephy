<template>
  <v-app :style="style" dark>
    <div class="mt-6 text-center">
      <h1>
        {{ pageNotFound }}
      </h1>
      <div>We suggest going back to the homepage while we fix this problem</div>
      <div>
        <v-avatar size="400" to="/">
          <img src="@/assets/404.svg" alt="" />
        </v-avatar>
      </div>
    </div>
    <router-link :to="{ name: 'dashboard' }" class="mt-6 text-center">
      Home page
    </router-link>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    resource: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pageNotFound: 'OOPSY... PAGE NOT FOUND',
      otherError: 'An error occurred'
    }
  },
  computed: {
    style() {
      const style = { backgroundColor: '#f8f8f8' }
      if (this.$vuetify.theme.dark) {
        style.backgroundColor = '#150e3a'
      }
      return style
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
