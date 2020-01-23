<template>
  <nav class="nav">
    <div class="logo">
      <nuxt-link :to="{name: 'index'}" class="logo text-lg">
        Home_Page
      </nuxt-link>
      <nuxt-link to="/users">
        Users
      </nuxt-link>
      <h1>
        User ID: {{ $route.params.id }}
      </h1>
      <span class="subheader">Will you find the one you dream about ?</span>
    </div>
  </nav>
</template>

<script>
export default {
  // data () {
  //   return {
  //     userId: ''
  //   }
  // },
  // control doesnt' work?? ==> to review validate (data) {}
  validate (data) {
    return /^\d+$/.test(data.params.id)
  }
}
</script>

<style scoped>
  nav {
    z-index: 4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 70px;
    font-weight: lighter;
    letter-spacing: 0.5px;
  }

  .nav .logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .nav .logo .subheader {
    opacity: 0.70;
    font-size: 0.9rem;
    color: white;
  }

  .nav .nav-content {
    font-size: 1rem;
  }

  .nav-content ul {
    display: flex;
    list-style: none;
  }

  .nav-content ul li {
    padding: 2px 10px;
  }

  .nav-content ul li:not(:first-of-type) {
    border-left: 1px solid rgb(255, 255, 255, 0.2);
  }
</style>
