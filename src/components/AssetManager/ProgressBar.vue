<template>
  <div>
    <div v-if="uploading" style="width: 70%" class="mx-auto">
      <v-progress-linear
        :value="uploading"
        rounded
        color="appBlue"
      ></v-progress-linear>
    </div>
    <div v-if="loading" style="width: 70%" class="mx-auto">
      <v-progress-linear
        indeterminate
        rounded
        color="appBlue"
      ></v-progress-linear>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      uploading: 'assetManager/uploading',
      loading: 'assetManager/loading'
    })
  }
}
</script>
