<template>
  <div>
    <div>
      <v-container
        class="font-weight-black purple--text text--lighten-5"
      >
        <br>Reset password with your email
      </v-container>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-container>
          <v-row>
            <v-col
              cols="8"
            >
              <v-text-field
                v-model.trim="reset.email"
                :rules="emailRules"
                counter="42"
                label="Email"
                required
              />
            </v-col>
          </v-row>
          <br>
          <v-row>
            <v-btn
              @click="validate"
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
  </div>
</template>

<script>
export default {
  middleware: 'notAuthenticated',
  data () {
    return {
      reset: {
        email: ''
      },
      valid: true,
      emailRules: [
        v => !!v || 'Email required',
        // v => v.length >= 3 || 'Pass must be more than 3 characters',
        v => (v && v.length <= 42) || 'Email must be less than 42 characters',
        v => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) || 'Must be a valid email [address@domain.com]'
      ]
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
          .$post(process.env.serverUrl + '/users/reset', {
            email: this.reset.email
          })
          .then((response) => {
            this.$store.dispatch('interact/setMessage', response.client)
            this.$router.push('/')
          })
          // eslint-disable-next-line
          .catch((error) => {
          })
      }
    }
  }
}
</script>
