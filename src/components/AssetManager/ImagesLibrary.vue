<template>
  <v-card color="accent" flat min-height="600">
    <v-row class="pa-4">
      <v-col
        v-for="(file, n) in files"
        :key="n"
        class="d-flex child-flex"
        cols="6"
        sm="4"
        md="3"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card
            style="cursor: pointer"
            class="mx-auto"
            flat
            color="transparent"
            max-width="600"
          >
            <v-img
              :src="file.url"
              :lazy-src="file.url"
              :height="imgSize"
              :width="imgSize"
              class="transparent"
              @click="selectFile(file)"
            >
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="transition-fast-in-fast-out accent v-card--reveal"
                  style="height: 20%"
                >
                  <div
                    class="d-sm-block float-left pt-1 pt-sm-4 pt-md-2 pl-2 caption"
                  >
                    {{ fileName(file.name) }}
                  </div>
                  <v-btn
                    icon
                    class="float-right mt-n1 mt-sm-1 mt-md-0"
                    @click.stop="deleteFile(file)"
                  >
                    <v-icon :small="$vuetify.breakpoint.name === 'xs'"
                      >mdi-delete</v-icon
                    >
                  </v-btn>
                </div>
              </v-expand-transition>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
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
          ext === 'png' ||
          ext === 'jpg' ||
          ext === 'jpeg' ||
          ext === 'svg' ||
          ext === 'gif'
        ) {
          files.push(file)
        }
      }
      return files
    },
    imgSize() {
      let size = 180
      if (this.$vuetify.breakpoint.name === 'xs') {
        size = 140
      } else if (this.$vuetify.breakpoint.name === 'sm') {
        size = 220
      }
      return size
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
    fileName(text) {
      let name
      let length = 16
      if (this.$vuetify.breakpoint.name === 'xs') {
        length = 12
      }
      if (text.length > length) {
        name = text.substring(0, length) + '...'
      } else {
        name = text
      }
      return name
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

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
</style>
