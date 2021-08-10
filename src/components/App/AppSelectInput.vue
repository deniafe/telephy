<template>
  <v-select
    background-color="background"
    color="primary"
    :items="items"
    item-text="title"
    item-color="appPink"
    :label="label"
    :value="value"
    :hint="hint"
    solo
    flat
    @input="sendEvent"
  ></v-select>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    hint: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'items'
    }
  },

  methods: {
    sendEvent(select) {
      this.$emit('input', select)
    }
  }
}
</script>

<style scoped>
.theme--dark.v-list {
  background-color: #150e3a;
  color: #ffffff;
}
</style>
