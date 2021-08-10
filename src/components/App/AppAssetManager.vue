<template>
  <v-dialog v-model="asset" persistent max-width="850">
    <v-card min-height="500" color="accent">
      <v-toolbar flat color="transparent">
        <v-toolbar-title>ASSET MANAGER</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon color="appPink" @click="closeDialog">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container color="accent">
        <v-tabs
          v-model="model"
          color="primary"
          background-color="transparent"
          show-arrows
        >
          <v-tab v-for="(tab, i) in tabs" :key="i">
            {{ tab }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="model">
          <v-tab-item v-for="(tab, i) in tabs" :key="i">
            <BrowseDevice v-if="tab === 'Browse Device'" />
            <!-- <OnlineLibrary v-if="tab === 'Free Online Library'" /> -->
            <ImagesLibrary v-if="tab === 'Images Library'" />
            <DocumentsLibrary v-if="tab === 'Documents Library'" />
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BrowseDevice from '@/components/AssetManager/BrowseDevice'
import ImagesLibrary from '@/components/AssetManager/ImagesLibrary'
import DocumentsLibrary from '@/components/AssetManager/DocumentsLibrary'
export default {
  components: {
    BrowseDevice,
    ImagesLibrary,
    DocumentsLibrary
  },
  data() {
    return {
      tabs: [
        'Browse Device',
        // 'Free Online Library',
        'Images Library',
        'Documents Library'
      ],
      model: 0,
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  computed: {
    ...mapGetters({
      showAssetManager: 'assetManager/showAssetManager'
    }),
    asset: {
      get() {
        return this.showAssetManager
      },
      set(val) {
        this.$store.commit('assetManager/SHOW_ASSET_MANAGER', val)
        this.resetTab()
      }
    },
    uploadButtonStyle() {
      const style = {
        position: 'relative',
        height: '50px',
        width: '200px'
      }

      return style
    }
  },
  mounted() {
    // this.getFiles()
  },
  methods: {
    ...mapActions({
      getFiles: 'assetManager/getFiles'
    }),
    saveUserSettings() {},
    resetTab() {
      this.model = 0
    },
    closeDialog() {
      this.$store.commit('assetManager/SHOW_ASSET_MANAGER', false)
      this.resetTab()
    }
  }
}
</script>
