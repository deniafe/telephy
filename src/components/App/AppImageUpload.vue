<template>
  <div>
    <v-avatar
      v-if="type === 'image'"
      v-ripple
      :rounded="round"
      :color="image ? 'transparent' : 'background'"
      :size="size"
      style="cursor: pointer"
      @click="showAssetManager"
    >
      <img v-if="type !== 'document' && image" :src="image" />
      <v-card v-if="!image" flat class="mx-2" color="appDeepBlue">
        <div class="caption">
          {{ fileName || label }}
        </div>
      </v-card>
    </v-avatar>
    <v-card
      v-if="type === 'document'"
      flat
      style="cursor: pointer"
      class="pa-4 mb-5"
      color="background"
      @click="showAssetManager"
    >
      <div class="caption">
        {{ fileName || label }}
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Click to upload an image'
    },
    value: {
      type: [Object, String],
      default: ''
    },
    type: {
      type: String,
      default: 'image'
    },
    component: {
      type: String,
      default: ''
    },
    round: {
      type: Boolean,
      default: false
    },
    size: {
      type: [Number, String],
      default: 150
    }
  },
  computed: {
    image() {
      return this.type === 'document' ? '' : this.value.url
    },
    fileName() {
      return this.value.name
    }
  },
  methods: {
    showAssetManager() {
      this.$store.commit('assetManager/SET_COMPONENT', this.component)
      this.$store.commit('assetManager/SHOW_ASSET_MANAGER', true)
    }
  }
}
</script>
