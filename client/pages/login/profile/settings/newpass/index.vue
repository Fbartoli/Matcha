<template>
  <div>
    <v-container
      class="font-weight-black"
    >
      Change your password
    </v-container>
    <div>
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
                  v-model="password"
                  :rules="passRules"
                  :type="passwordVisible ? 'text' : 'password'"
                  counter="20"
                  label="Current password"
                  required
                />
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="5"
            >
              <div>
                <v-text-field
                  v-model="password2"
                  :rules="passRules"
                  :type="passwordVisible ? 'text' : 'password'"
                  counter="20"
                  label="New Password"
                  required
                />
              </div>
            </v-col>

            <v-col
              cols="5"
            >
              <v-text-field
                v-model="password1"
                :rules="passRules"
                :type="passwordVisible ? 'text' : 'password'"
                counter="20"
                label="Confirm your new password"
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
      <v-row class="font-italic">
        <v-col>
          <br>
          Forgot your password ?
          <nuxt-link to="/reset">
            Reset password
          </nuxt-link>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>

export default {
  middleware: 'authenticated',
  data () {
    return {
      valid: true,
      password: '',
      password1: '',
      password2: '',
      passRules: [
        v => !!v || 'Password is required',
        // v => v.length >= 3 || 'Pass must be more than 3 characters',
        v => (v && v.length <= 20) || 'Password must be less than 20 characters',
        v => /[a-z]+/.test(v) || '1 lowercase letter [abc...] required.',
        v => /[A-Z]+/.test(v) || '1 uppercase letter [ABC...] required.',
        v => /[0-9]+/.test(v) || '1 number [0123...] required.',
        v => /.{8,}/.test(v) || '8 characters minimum.'
      ],
      passwordVisible: false
    }
  },
  computed: {
    samePasswords () {
      if (this.password1 === this.password2 && this.password1.length > 0) {
        return true
      } else {
        return false
      }
    },
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    },
    loadedUsers () {
      return this.$store.getters['user/loadedUsers']
    },
    token () {
      return this.$store.getters['user/token']
    }
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.$axios({
          method: 'post',
          url: process.env.serverUrl + '/edit/password',
          data: {
            password2: this.password2,
            password: this.password
          },
          headers: {
            Authorization: 'Bearer ' + this.$store.getters['user/token']
          }
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
