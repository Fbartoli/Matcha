<template>
  <div class="admin-page">
    <section class="new-post">
      <br>
      <br>
      <form @submit.prevent="onPostLogin">
        <AppControlInput
          v-model="checkRegister.username"
        >
          Username
        </AppControlInput>
        <AppControlInput
          v-model="checkRegister.surname"
        >
          Surname
        </AppControlInput>
        <br>
        <AppControlInput
          v-model="checkRegister.name"
        >
          Name
        </AppControlInput>
        <br>
        <AppControlInput
          v-model="checkRegister.email"
        >
          Email
        </AppControlInput>
        <br>
        <AppControlInput
          v-model="checkRegister.password"
        >
          Password
        </AppControlInput>
        <br>
        <AppButton
          type="submit"
        >
          VALID
        </AppButton>
        <br>
      </form>
    </section>
  </div>
</template>

<script>
import AppControlInput from '@/components/UI/AppControlInput'
import AppButton from '@/components/UI/AppButton'
/* eslint-disable */

export default {
  components: {
    AppControlInput,
    AppButton
  },
  data () {
    return {
      checkRegister:
      {
        username: '',
        name: '',
        surname: '',
        email: '',
        password: ''
      }
    }
  },
  // computed: {
  //   loadedRegisters() {
  //     return this.$store.getters.loadedRegisters
  //   }
  // },
  methods: {
    onPostLogin () {
      this.$axios
        // .$post('https://api.github.com/users/mapbox', {
        .$post('http://10.13.11.22:8080/register', {
          username: this.checkRegister.username,
          name: this.checkRegister.name,
          surname: this.checkRegister.surname,
          email: this.checkRegister.email,
          password: this.checkRegister.password,
        })
        .then(function (res) {
        /* eslint-disable */
          console.log(res)
          console.log(res.data)
          console.log(res.status)
          console.log(res.statusText)
          console.log(res.headers)
          console.log(res.config)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}
</style>
