<template>
  <v-card color="accent" flat min-height="600">
    <v-card
      flat
      color="transparent"
      height="200"
      class="d-flex justify-center align-center pt-12"
    >
      <div
        v-ripple
        class="appDeepBlue d-flex justify-center align-center rounded"
        :style="uploadButtonStyle"
      >
        <div>Upload an image</div>

        <input
          type="file"
          style="
            opacity: 0;
            position: absolute;
            z-index: 15;
            cursor: pointer;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
          "
          tabindex="2"
          @change="uploadFile"
        />
      </div>
    </v-card>
    <ProgressBar />
  </v-card>
</template>

<script>
import ProgressBar from '@/components/AssetManager/ProgressBar'
export default {
  components: {
    ProgressBar
  },
  computed: {
    uploadButtonStyle() {
      const style = {
        position: 'relative',
        height: '50px',
        width: '200px'
      }

      return style
    }
  },
  methods: {
    uploadFile($event) {
      const val = $event.target.files[0]
      // If the user actually picks a file
      if (val.size > 1048576) {
        const notification = {
          message:
            'File too large to be uploaded. Make sure file size is not more than 1mb',
          type: 'info'
        }
        this.$store.dispatch('notification/setNotification', notification)
        this.$store.dispatch('notification/showNotification', true)
      }
      if (val && val.size <= 1048576) {
        this.$store.dispatch('assetManager/uploadFile', val)
      }
    }
  }
}
</script>
