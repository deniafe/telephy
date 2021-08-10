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
              d="M41.28,0c-3.7625,0 -6.88,3.1175 -6.88,6.88v6.88h-20.64c-3.68187,0 -6.88,2.76813 -6.88,6.73219v138.46c0,1.97531 1.14219,3.88344 2.52625,4.86438c1.38406,0.9675 2.88906,1.30344 4.35375,1.30344h144.48c1.46469,0 2.96969,-0.33594 4.35375,-1.30344c1.38406,-0.98094 2.52625,-2.88906 2.52625,-4.86438v-138.46c0,-3.60125 -2.91594,-6.73219 -6.59781,-6.73219h-20.92219v-6.88c0,-3.7625 -3.1175,-6.88 -6.88,-6.88h-6.88c-3.7625,0 -6.88,3.1175 -6.88,6.88v6.88h-61.92v-6.88c0,-3.7625 -3.1175,-6.88 -6.88,-6.88zM41.28,6.88h6.88v20.64h-6.88zM123.84,6.88h6.88v20.64h-6.88zM13.76,20.64h20.64v6.88c0,3.7625 3.1175,6.88 6.88,6.88h6.88c3.7625,0 6.88,-3.1175 6.88,-6.88v-6.88h61.92v6.88c0,3.7625 3.1175,6.88 6.88,6.88h6.88c3.7625,0 6.88,-3.1175 6.88,-6.88v-6.88h20.64v24.08h-144.48zM13.76,51.6h144.48v106.64h-144.48zM112.49875,70.92313l-1.86781,2.88906l-28.01719,43.47031l-18.3825,-16.63562l-2.55312,-2.29781l-4.60906,5.09281l2.53969,2.31125l24.4025,22.06437l32.39781,-50.26969l1.86781,-2.88906z"
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
  data() {
    return {
      fill: '#00a2ff'
    }
  },
  computed: {
    styling() {
      return {
        marginTop: this.margin + 'px',
        cursor: 'pointer'
      }
    }
  }
}
</script>

<style scoped></style>
