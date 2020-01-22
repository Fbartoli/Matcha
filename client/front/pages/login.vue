
<template>
  <div class="container">
    <article>
      <h1
        class="title"
      >
        Login Page
      </h1>
      <p>Type your login and password to connect !</p>
      <input v-model="userId" type="text" style="background-color: #f4cbf9">
      <button
        @click="onLoadUser"
      >
        Load User
      </button>
      <nuxt-child />
    </article>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userId: ''
    }
  },
  methods: {
    onLoadUser () {
      this.$router.push('/users/' + this.userId)
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: space-between;
    line-height: 1.5;
  }

  article * {
    margin-bottom: 1rem;
  }

  aside {
    min-width: 280px;
    max-width: 280px;
    padding-left: 2rem;
  }

  .title {
    font-size: 2rem;
  }
</style>
