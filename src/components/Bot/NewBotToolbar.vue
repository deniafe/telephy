<template>
  <v-toolbar flat color="#150e3a" class="px-6 mt-8 mb-4">
    <div class="mx-auto">
      <AppButton :text="'Create New Bot'" @click="createNewBot" />
    </div>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    createNewBot() {
      this.$store.commit('bot/SET_BOT_DIALOG', true)
    }
  }
}
</script>

<style scoped>
.tasks {
  color: white;
  font-weight: 300;
  font-family: 'Raleway', sans-serif;
}
.all.tasks {
  color: #fff;
}
.today.tasks {
  color: #085598;
}
</style>
