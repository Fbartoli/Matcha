<template>
  <div>

    <!-- <p v-if="userId == ''">To access a specific user, enter a userId and click the button:</p>
    <p v-else>Type a userId first before to press the button</p> -->
    <input
      type="text"
      v-model="userId"
    />
    <button
      v-on="listeners"
      @click="OnLoadUser"
    >
      BUTTON (prevent empty field )> Go to the user corresponding to this userId
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userId: ''
    }
  },
  computed: {
    listeners() {
      if (this.userId !== '') {
        return { click: this.OnLoadUser }
      }
      return null
    }
  },
  methods: {
    OnLoadUser () {
      this.$router.push('/users/' + this.userId)
    }
  }
}
</script>
