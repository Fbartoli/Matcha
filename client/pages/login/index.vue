<template>
  <div>
    <v-container
      class="font-weight-black purple--text text--lighten-5"
    >
      <br>Welcome !
    </v-container>
    <div>
      <br>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-container>
          <v-row>
            <v-col
              cols="10"
            >
              <v-text-field
                v-model.trim="login.username"
                counter="20"
                label="Username"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="10"
            >
              <div>
                <v-text-field
                  v-model.trim="login.password"
                  :type="passwordVisible ? 'text' : 'password'"
                  counter="20"
                  label="Password"
                  required
                />
              </div>
            </v-col>
            <v-col
              cols="1"
            >
              <div
                @click="togglePasswordVisibility"
                :arial-label="passwordVisible ? 'Hide password' : 'Show password'"
                tabindex="-1"
              >
                <v-icon
                  v-if="passwordVisible"
                  large
                >
                  mdi-eye
                </v-icon>
                <v-icon
                  v-else
                  large
                >
                  mdi-eye-off
                </v-icon>
              </div>
            </v-col>
          </v-row>
          <br>
          <v-row>
            <v-col>
              <v-btn
                @click="validate"
                :disabled="!valid"
                color="blue lighten-4"
                class="mr-4"
              >
                Log in
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-row class="font-italic">
        <v-col>
          <br>
          Did you forget your pass?
          <nuxt-link to="/reset">
            Reset password
          </nuxt-link>
        </v-col>
      </v-row>
      <v-row class="font-italic">
        <v-col>
          No account?
          <nuxt-link to="/register">
            Create a new profile !
          </nuxt-link>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// import ionia from 'socket.io-client'
import socket from '~/plugins/socket.io.js'

/* eslint-disable */
export default {
  middleware: 'notAuthenticated',
  data () {
    return {
      login: {
        username: '',
        password: ''
      },
      valid: true,
      // usernameRules: [
      //   v => !!v || 'Username is required',
      //   // v => v.length >= 3 || 'Pass must be more than 3 characters',
      //   v => (v && v.length <= 20) || 'Password must be less than 20 characters',
      //   v => /.{3,}/.test(v) || '3 characters minimum.',
      //   v => /^[a-zA-Z0-9_.-]*$/.test(v) || 'Must be alphanumeric characters [Abc123...]'
      // ],
      // passRules: [
      //   v => !!v || 'Password is required',
      //   // v => v.length >= 3 || 'Pass must be more than 3 characters',
      //   v => (v && v.length <= 20) || 'Password must be less than 20 characters',
      //   v => /[a-z]+/.test(v) || '1 lowercase letter [abc...] required.',
      //   v => /[A-Z]+/.test(v) || '1 uppercase letter [ABC...] required.',
      //   v => /.{8,}/.test(v) || '8 characters minimum.',
      //   v => /[0-9]+/.test(v) || '1 number [0123...] required.'
      // ],
      passwordVisible: false
    }
  },
  computed: {
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    }
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.$axios
          .$post(process.env.serverUrl + '/users/login', {
            username: this.login.username,
            password: this.login.password
          })
          .then((response) => {
            this.$store.dispatch('user/setUserData', response.userdata)
            this.$store.dispatch('user/setToken', response.token)
            this.$store.dispatch('interact/setMessage', response.client)
            socket.emit('login', this.login.username)
            if (response.userdata.profile_complete === 0)
              this.$router.push('/login/profile/settings')
            else
              this.$router.push('/')
          })
          .catch((error) => {
          })
      }
    },
    togglePasswordVisibility () {
      this.passwordVisible = !this.passwordVisible
    }
  }
}
</script>
