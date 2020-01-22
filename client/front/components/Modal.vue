<template>
  <div>
    <div
      @click="isOpen = true"
      class="app-button"
    >
      Test
    </div>
    <div :class="{'is-active': isOpen}" class="modal">
      <div class="modal-content">
        <span @click="close" class="close">&times;</span>
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  // props: {
  //   close: {
  //     type: Boolean,
  //     required: false
  //   }
  // },
  data () {
    return {
      isOpen: false
    }
  },
  watch: {
    close (isClose, preIsClose) {
      if (isClose && this.isOpen) {
        this.isOpen = false
      }
    }
  },
  methods: {
    close () {
      this.isOpen = false
    }
  }
}
</script>
