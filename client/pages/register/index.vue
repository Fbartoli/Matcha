<template>
  <div>
    <v-container
      class="font-weight-black purple--text text--lighten-5"
    >
      Do you wish for a lovely blast ? Register.
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
              cols="12"
            >
              <v-text-field
                v-model.trim="checkRegister.username"
                :rules="rules.usernameRules"
                counter="20"
                label="Username"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="6"
            >
              <v-text-field
                v-model.trim="checkRegister.name"
                :rules="rules.nameRules"
                counter="20"
                label="First name"
                required
              />
            </v-col>
            <v-col
              cols="6"
            >
              <v-text-field
                v-model.trim="checkRegister.surname"
                :rules="rules.nameRules"
                counter="20"
                label="Last name"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model.trim="checkRegister.email"
                :rules="rules.emailRules"
                counter="42"
                label="Email"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="5"
            >
              <div>
                <v-text-field
                  v-model.trim="checkRegister.password"
                  :rules="rules.passRules"
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
                :rules="rules.passRules"
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
          <v-row>
            <v-col
              cols="5"
            >
              <v-text-field
                v-if="!samePasswords"
                class="font-italic"
                value="Password and Password confirmation are different"
                disabled
                readonly
                required
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
          >
            <v-col
              cols="1"
            >
              <v-checkbox
                v-model="agreement"
                :rules="rules.requiredRules"
                color="purple darken-1"
              />
            </v-col>
            <v-col
              cols="9"
            >
              I agree to the&nbsp;
              <a @click.stop.prevent="dialog = true" href="#">Terms of Service&nbsp;and&nbsp;Privacy Policy</a>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                @click="validate"
                v-if="samePasswords"
                :disabled="!valid"
                color="blue lighten-4"
                class="mr-4"
              >
                Validate
              </v-btn>
              <v-dialog
                v-model="dialog"
                absolute
                max-width="400"
                persistent
              >
                <v-card>
                  <v-card-title
                    class="headline purple lighten-4 purple--text text--darken-4"
                  >
                    Legal
                  </v-card-title>
                  <v-card-text>
                    <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-btn
                      @click="agreement = false, dialog = false"
                      text
                    >
                      No
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      @click="agreement = true, dialog = false"
                      class="white--text"
                      color="purple darken-1"
                    >
                      Yes
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>

export default {
  middleware: 'notAuthenticated',
  data () {
    return {
      checkRegister:
      {
        username: '',
        name: '',
        surname: '',
        email: '',
        password: ''
      },
      valid: false,
      password2: '',
      passwordVisible: false,
      dialog: false,
      agreement: false,
      rules: {
        usernameRules: [
          v => !!v || 'Username is required',
          v => (v && v.length <= 20) || 'Password must be less than 20 characters',
          v => /.{6,}/.test(v) || '6 characters minimum.',
          v => /^[a-zA-Z0-9_.-]*$/.test(v) || 'Must be alphanumeric characters [Abc123...]'
        ],
        nameRules: [
          v => !!v || 'Field required',
          v => (v && v.length <= 20) || 'Must be less than 20 characters',
          v => /^[a-zA-Z_.-]*$/.test(v) || 'Must be letters only',
          v => (v && v.length >= 2) || 'At least 2 characters'
        ],
        emailRules: [
          v => !!v || 'Email is required',
          v => (v && v.length <= 42) || 'Email must be less than 42 characters',
          v => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) || 'Must be a valid email [address@domain.com]'
        ],
        passRules: [
          v => !!v || 'Password is required',
          v => (v && v.length <= 20) || 'Password must be less than 20 characters',
          v => /[a-z]+/.test(v) || '1 lowercase letter [abc...] required.',
          v => /[A-Z]+/.test(v) || '1 uppercase letter [ABC...] required.',
          v => /[0-9]+/.test(v) || '1 number [0123...] required.',
          v => /.{8,}/.test(v) || '8 characters minimum.'
        ],
        requiredRules: [
          v => !!v || ''
        ]
      }
    }
  },
  computed: {
    samePasswords () {
      if (this.checkRegister.password === this.password2) {
        return true
      } else {
        return false
      }
    },
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    }
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('user/registerUser', this.checkRegister)
        this.$router.push('/')
      }
    },
    togglePasswordVisibility () {
      this.passwordVisible = !this.passwordVisible
    }
  }
}
</script>
