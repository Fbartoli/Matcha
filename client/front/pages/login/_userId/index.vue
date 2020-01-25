
<template>
  <div class="container">
    <section>
      <h1
        class=""
      >
        Login Page
      </h1>
      <p>Type your login and password to connect !</p>
      <LoginForm />
    </section>
  </div>
</template>

<script>
import LoginForm from '@/components/users/LoginForm'

export default {
  components: {
    LoginForm
  }
}
</script>

<style scoped>

  /* .container {
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
  } */
</style>
