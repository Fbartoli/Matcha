<template>
  <div>
    <div v-if="checker === true">
      <br>
      <br>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-container>
          <v-row>
            <v-col
              cols="5"
            >
              <div>
                <v-text-field
                  v-model.trim="password1"
                  :rules="passRules"
                  :type="passwordVisible ? 'text' : 'password'"
                  counter="20"
                  label="Password"
                  required
                />
              </div>
            </v-col>

            <v-col
              cols="5"
            >
              <v-text-field
                v-model.trim="password2"
                :rules="passRules"
                :type="passwordVisible ? 'text' : 'password'"
                counter="20"
                label="Confirm your password"
                required
              />
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
            <v-btn
              @click="validate"
              v-if="samePasswords"
              :disabled="!valid"
              color="blue lighten-4"
              class="mr-4"
            >
              Validate
            </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <div v-else>
      Link already used or wrong URL
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'notAuthenticated',
  data () {
    return {
      valid: true,
      password1: '',
      password2: '',
      passRules: [
        v => !!v || 'Password is required',
        // v => v.length >= 3 || 'Pass must be more than 3 characters',
        v => (v && v.length <= 20) || 'Password must be less than 20 characters',
        v => /[a-z]+/.test(v) || '1 lowercase letter [abc...] required.',
        v => /[A-Z]+/.test(v) || '1 uppercase letter [ABC...] required.',
        v => /.{8,}/.test(v) || '8 characters minimum.',
        v => /[0-9]+/.test(v) || '1 number [0123...] required.'
      ],
      passwordVisible: false
    }
  },
  computed: {
    checker () {
      return this.$store.getters['user/checker']
    },
    samePasswords () {
      if (this.password1 === this.password2 && this.password1.length > 0) {
        return true
      } else {
        return false
      }
    },
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    }
  },
  async asyncData (context) {
    const newpass = await axios
      .get(process.env.serverUrl + '/users/password', {
        params: {
          id: context.query.id,
          username: context.query.username
        }
      })
      .then((response) => {
        context.store.dispatch('user/setChecker', false)
        if (response.status === 200 || response.status === '200') {
          context.store.dispatch('user/setUsername', context.query.username)
          context.store.dispatch('user/setChecker', true)
          context.store.dispatch('interact/setMessage', 'Link activated !')
        }
      })
      // eslint-disable-next-line
      .catch((error) => {
        context.store.dispatch('user/setChecker', false)
        context.store.dispatch('interact/setMessage', 'Link already activated or wrong URL')
        context.redirect('/')
      })
    return {
      newpass
    }
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.$axios
          .$post(process.env.serverUrl + '/users/password', {
            password2: this.password2,
            username: this.$store.getters['user/loadedUsers'].username
          })
          .then((response) => {
            this.$store.dispatch('interact/setMessage', 'New password updated !')
            this.$router.push('/')
          })
          // eslint-disable-next-line
          .catch(function (error) {
          })
      }
    },
    togglePasswordVisibility () {
      this.passwordVisible = !this.passwordVisible
    }
  }
}
</script>
