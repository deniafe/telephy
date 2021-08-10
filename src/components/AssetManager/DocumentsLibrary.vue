<template>
  <v-card color="accent" flat class="pa-4 pt-8" min-height="600">
    <v-card
      v-for="(file, index) in files"
      :key="index"
      flat
      class="mx-4 mb-0 mt-2"
      color="background"
      @click="selectFile(file)"
    >
      <v-row wrap>
        <v-col cols="4" sm="2" md="2">
          <div class="mt-4 pl-4">
            <v-icon size="30" color="primary">mdi-folder</v-icon>
          </div>
        </v-col>
        <v-col cols="8" sm="4" md="4">
          <div class="caption grey--text">File Name</div>
          <p class="primary--text subtitle-2">{{ file.name }}</p>
        </v-col>
        <v-col class="pl-12" cols="6" sm="4" md="4">
          <div class="caption grey--text">File Size</div>
          <div class="caption primary--text font-weight-bold">10mb</div>
        </v-col>
        <v-col cols="4" sm="2" md="2" class="pr-8 pt-6">
          <v-btn class="float-sm-right" icon @click.stop="deleteFile(file)">
            <v-icon size="20" color="appPink">mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      allFiles: 'assetManager/files',
      type: 'assetManager/type',
      component: 'assetManager/component'
    }),
    files() {
      let ext
      const files = []
      let file
      for (let i = 0; i < this.allFiles.length; i++) {
        file = this.allFiles[i]
        ext = this.getFileExtention(file.name)
        if (
          ext !== 'png' &&
          ext !== 'jpg' &&
          ext !== 'jpeg' &&
          ext !== 'svg' &&
          ext !== 'gif'
        ) {
          files.push(file)
        }
      }
      return files
    }
  },
  mounted() {
    this.$store.dispatch('assetManager/getFiles')
  },
  methods: {
    getFileExtention(filename) {
      return (
        filename.substring(filename.lastIndexOf('.') + 1, filename.length) ||
        filename
      )
    },
    selectFile(file) {
      this.$store.dispatch('assetManager/selectFile', file)
      this.closeAssetManager()
    },
    deleteFile(file) {
      this.$store.dispatch('assetManager/deleteFile', file)
    },
    closeAssetManager() {
      this.$store.commit('assetManager/SHOW_ASSET_MANAGER', false)
    }
  }
}
</script>
