<template>
  <div>
    <div>
      <br>
      <v-container
        class="font-weight-black purple--text text--lighten-5"
      >
        Update your personal information
      </v-container>
      <div>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-container>
            <v-row>
              <v-col>
                <v-btn
                  @click="validate"
                  :disabled="!valid"
                  color="blue lighten-4"
                  class="mr-4"
                >
                  Update
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="5"
              >
                <v-text-field
                  v-model.trim="loadedUsers.name"
                  :rules="nameRules"
                  counter="20"
                  label="First name"
                  required
                />
              </v-col>
              <v-col
                cols="5"
              >
                <v-text-field
                  v-model.trim="loadedUsers.surname"
                  :rules="nameRules"
                  counter="20"
                  label="Last name"
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="10"
              >
                <v-text-field
                  v-model.trim="loadedUsers.email"
                  :rules="emailRules"
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
                <v-text-field
                  v-model="loadedUsers.birth_date"
                  readonly
                  label=" Birth date (use the calendar to pick)"
                />
                <v-date-picker
                  v-model="loadedUsers.birth_date"
                  :landscape="false"
                  min="1921-01-01"
                  max="2002-05-05"
                  color="purple lighten-4"
                  year-icon="mdi-calendar-blank"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-radio-group
                  :rules="genderRules"
                  v-model="loadedUsers.gender_id"
                  row="row"
                  label="My gender is..."
                >
                  <v-radio :value="3" label="Female" />
                  <v-radio :value="2" label="Male" />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-radio-group
                  :rules="interestedinRules"
                  v-model="loadedUsers.interested_in"
                  row="row"
                  max="1"
                  label="I am interested in..."
                >
                  <v-radio :value="3" label="Women" />
                  <v-radio :value="2" label="Men" />
                  <v-radio :value="1" label="Both" />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row
              style="background-color: rgba(0, 0, 0, 0)"
            >
              <v-col cols="10">
                <v-select
                  v-model="loadedUsers.tags"
                  :items="hobbies"
                  attach
                  chips
                  label="Tags"
                  multiple
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="10"
              >
                <v-textarea
                  v-model.trim="loadedUsers.bio"
                  :rules="bioRules"
                  :auto-grow="true"
                  :filled="true"
                  :rounded="true"
                  counter="252"
                  placeholder="I love hairy Chewbaccas and I eat a bunch at breakfast"
                  label="My description"
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  @click="validate"
                  :disabled="!valid"
                  color="blue lighten-4"
                  class="mr-4"
                >
                  Update
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <br>
        <v-row class="font-italic">
          <v-col>
            <br>
            Do you want to change your password ?
            <nuxt-link to="/login/profile/settings/newpass">
              Change password
            </nuxt-link>
          </v-col>
        </v-row>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'profileComplete',
  data () {
    return {
      valid: true,
      // usernameRules: [
      //   v => !!v || 'Username is required',
      //   v => (v && v.length <= 20) || 'Password must be less than 20 characters',
      //   v => /.{6,}/.test(v) || '6 characters minimum.',
      //   v => /^[a-zA-Z0-9_.-]*$/.test(v) || 'Must be alphanumeric characters [Abc123...]'
      // ],
      nameRules: [
        v => !!v || 'Field required',
        v => (v && v.length <= 20) || 'Must be less than 20 characters',
        v => /^[a-zA-Z_.-]*$/.test(v) || 'Must be letters only'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => (v && v.length <= 42) || 'Email must be less than 42 characters',
        v => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) || 'Must be a valid email [address@domain.com]'
      ],
      bioRules: [
        v => !!v || 'Description is required',
        v => (v && v.length >= 12) || '12 characters minimum',
        v => (v && v.length <= 252) || 'Description must be less than 252 characters',
        v => /[^\t\n\r]/.test(v) || 'Only spaces authorized'
      ],
      interestedinRules: [
        v => !!v || 'Preference required',
        v => (v > 0 && v < 4) || 'Pick one of the 3 choices',
        v => /[0-9]+/.test(v) || 'Use the form to pick a value'
      ],
      genderRules: [
        v => !!v || 'Gender required',
        v => (v > 1 && v < 4) || 'Pick one of the 2 choices',
        v => /[0-9]+/.test(v) || 'Use the form to pick a value'
      ],
      hobbies: ['#gamer', '#surfer', '#hacker', '#starwars', '#meditation', '#42', '#geek', '#fashion', '#hipster', '#horse', '#vegan', '#meat', '#', '#coding', '#C', '#python', '#anime', '#yachting', '#matcha', '#macron']
    }
  },
  computed: {
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
  async asyncData (context) {
    const usersettings = await axios
      .get(process.env.serverUrl + '/users/user', {
        headers: {
          Authorization: 'Bearer ' + context.app.store.getters['user/token']
        }
      })
      .then((response) => {
        context.store.dispatch('user/setUserData', response.data.userdata)
      })
      // eslint-disable-next-line
      .catch((error) => {
      })
    return {
      usersettings
    }
  },
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.$axios({
          method: 'post',
          url: process.env.serverUrl + '/users/user',
          data: {
            // username: this.loadedUsers.username,
            name: this.loadedUsers.name,
            surname: this.loadedUsers.surname,
            email: this.loadedUsers.email,
            bio: this.loadedUsers.bio,
            birth_date: this.loadedUsers.birth_date,
            gender_id: this.loadedUsers.gender_id,
            interested_in: this.loadedUsers.interested_in,
            tags: this.loadedUsers.tags.toString()
          },
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters['user/token']
          }
        })
          .then((response) => {
            this.$store.dispatch('interact/setMessage', 'Personal information updated !')
            this.$router.push('/')
          })
          // eslint-disable-next-line
          .catch((error) => {
          })
        this.$router.push('/settings')
      }
    }
  }
}
</script>
