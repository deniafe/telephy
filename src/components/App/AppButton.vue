<template>
  <div>
    <v-btn :width="width" :height="height" @click="$emit('click')">
      <div :style="buttonStyles" class="btn">
        <slot>Login</slot>
      </div></v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 46
    },
    paddingTop: {
      type: Number,
      default: 15
    },
    fontSize: {
      type: Number,
      default: 12
    }
  },
  computed: {
    buttonStyles() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        paddingTop: `${this.paddingTop}px`,
        fontSize: `${this.fontSize}px`
      }
    }
  }
}
</script>

<style scoped>
.btn {
  position: relative;
  cursor: pointer;
  background: radial-gradient(
    at 10% 10%,
    rgb(0, 74, 255) 0%,
    rgb(0, 162, 255) 100%
  );
  border: 1px none rgb(127, 149, 235);
  text-align: center;
  box-sizing: border-box;
  font-weight: 600;
  color: rgb(255, 255, 255);
  border-radius: 3px;
  transition: background 200ms ease 0s;
}
.btn:hover {
  background: radial-gradient(
    at 50% 50%,
    rgb(0, 162, 255) 0%,
    rgb(0, 74, 255) 100%
  );
}
</style>
