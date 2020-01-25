<template>
  <section class="auth-list">
    <!-- <TheNavbar
      v-for="auth in auths"
      :key="auth.id"
      :is-logged="isLogged"
      :id="auth.id"
      :username="auth.username"
      :password="auth.password"
      :name="auth.name"
      :surname="auth.surname"
      :token="auth.token"
      :email="auth.email"
      :birth_date="auth.birth_date"
      :location="auth.location"
      :photo="auth.photo"
    /> -->
  </section>
</template>

<script>
export default {
  // name: 'AuthList',
  // props: {
  //   id: {
  //     type: String,
  //     default: ''
  //   },
  //   username: {
  //     type: String,
  //     default: ''
  //   },
  //   password: {
  //     type: String,
  //     default: ''
  //   },
  //   name: {
  //     type: String,
  //     default: ''
  //   },
  //   surname: {
  //     type: String,
  //     default: ''
  //   },
  //   token: {
  //     type: String,
  //     default: ''
  //   },
  //   email: {
  //     type: String,
  //     default: ''
  //   },
  //   birth_date: {
  //     type: String,
  //     default: ''
  //   },
  //   location: {
  //     type: String,
  //     default: ''
  //   },
  //   photo: {
  //     type: String,
  //     default: ''
  //   },
  //   isLogged: {
  //     type: Boolean,
  //     default: false
  //   },

    // auths: {
    //   type: Array,
    //   required: true,
    //   // default: null
    // }
  // }
}
</script>


<style scoped>

.auth-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>

