<template>
  <div class="admin-page">
    <section class="new-post">
      <AppButton
        @click="$router.push('/login/auth')"
      >
        Go directly to the Post Login page
      </AppButton>
      <br>
      <br>
      <form @submit.prevent="onPostLogin">
        <AppControlInput
          v-model="checkAuth.username"
        >
          Username
        </AppControlInput>
        <AppControlInput
          v-model="checkAuth.password"
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
// import axios from 'axios'
// import LoginForm from '@/components/users/LoginForm'
import AppControlInput from '@/components/UI/AppControlInput'
import AppButton from '@/components/UI/AppButton'

export default {
  components: {
    AppControlInput,
    // axios,
    // LoginForm,
    AppButton
  },
  data () {
    return {
      checkAuth:
      {
        username: 'aa',
        password: 'secret'
      }
    }
  },
  // computed: {
  //   loadedAuths() {
  //     return this.$store.getters.loadedAuths
  //   }
  // },
  methods: {
    onPostLogin () {
      this.$axios
        .$post('10.12.8.11:8080/login', {
          // username: this.username,
          // password: this.password
          username: this.checkAuth.username,
          password: this.checkAuth.password
        })
      //   .then(result => {
      // /* eslint-disable */
      //     console.log(result);
      //   })
      /* eslint-disable */
      // .catch(e => console.log(e));
    }
  }
      //
      // this.$store.dispatch ('addAuth', authData)
      //   .then (() => {
      //     this.$router.push("/")
      //   })
      //
      // // URL to send data + node to store the data
      // axios
      //   .post ('', authData)
      //   // eslint-disable-next-line
      //   .then (result => console.log (result))
      //   // eslint-disable-next-line
      //   // .then (result => this.$router.push('/')
      //   // eslint-disable-next-line
      //   .catch (e => console.log (e))
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

