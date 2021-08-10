<template>
  <div class="py-2" :style="styling" @click="$emit('click')">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="30"
        height="30"
        viewBox="0 0 172 172"
        style="fill: #000000"
      >
        <g
          fill="none"
          fill-rule="nonzero"
          stroke="none"
          stroke-width="1"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          stroke-miterlimit="10"
          stroke-dasharray=""
          stroke-dashoffset="0"
          font-family="none"
          font-weight="none"
          font-size="none"
          text-anchor="none"
          style="mix-blend-mode: normal"
        >
          <path d="M0,172v-172h172v172z" fill="none"></path>
          <g :fill="fill">
            <path
              d="M17.2,13.76c-5.6587,0 -10.32,4.6613 -10.32,10.32v30.96v6.88v86c0,5.6587 4.6613,10.32 10.32,10.32h137.6c5.6587,0 10.32,-4.6613 10.32,-10.32v-82.56v-10.32v-17.2c0,-5.6587 -4.6613,-10.32 -10.32,-10.32h-92.88c0.2978,0 -0.10667,0.00125 -0.94735,-0.9675c-0.84067,-0.96875 -1.87545,-2.5759 -2.95625,-4.3c-1.08079,-1.7241 -2.21349,-3.5637 -3.64156,-5.18016c-1.42807,-1.61645 -3.39833,-3.31234 -6.21485,-3.31234zM17.2,20.64h30.96c-0.20898,0 0.21032,0.02411 1.06156,0.98766c0.85125,0.96355 1.88731,2.56394 2.96297,4.27984c1.07566,1.7159 2.18958,3.54875 3.58781,5.16c1.39823,1.61125 3.32316,3.3325 6.14765,3.3325h92.88c1.9437,0 3.44,1.4963 3.44,3.44v7.525c-1.08323,-0.39065 -2.22966,-0.645 -3.44,-0.645h-137.6c-1.21034,0 -2.35677,0.25435 -3.44,0.645v-21.285c0,-1.9437 1.4963,-3.44 3.44,-3.44zM17.2,51.6h137.6c1.9437,0 3.44,1.4963 3.44,3.44v10.32v82.56c0,1.9437 -1.4963,3.44 -3.44,3.44h-137.6c-1.9437,0 -3.44,-1.4963 -3.44,-3.44v-86v-6.88c0,-1.9437 1.4963,-3.44 3.44,-3.44z"
            ></path>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    margin: {
      type: Number,
      default: 0
    }
  },
  computed: {
    styling() {
      return {
        marginTop: this.margin + 'px',
        cursor: 'pointer'
      }
    },
    fill() {
      const currentRoute = this.$route.name
      let fill = '#00a2ff'
      if (currentRoute === 'bot' || currentRoute === 'bot-id') {
        fill = '#ffffff'
      }
      return fill
    }
  }
}
</script>

<style scoped></style>
