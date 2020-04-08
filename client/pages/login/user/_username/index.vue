<template>
  <div>
    <div v-if="checker === true">
      <v-container
        class="font-weight-black purple--text text--lighten-5"
        style="display: flex; justify-content: center;"
      >
        {{ target }}'s profile page !
      </v-container>
      <v-card
        :hover="true"
        v-ripple="{ class: `purple--text` }"
        class="mx-auto"
        max-width="434"
        color="deep-purple lighten-5"
      >
        <v-img
          :src="`data:image/*;base64,${loadedSearchProfile.photos[1]}`"
          aspect-ratio="2"
          class="spacer blue lighten-2"
          no-gutters
        >
          <v-row
            align="end"
            class="fill-height"
          >
            <v-col
              align-self="start"
              class="pa-0"
              cols="12"
            >
              <v-avatar
                class="profile indigo accent-4"
                size="164"
              >
                <v-img
                  :src="`data:image/*;base64,${loadedSearchProfile.photos[0]}`"
                />
              </v-avatar>
            </v-col>
          </v-row>
        </v-img>
        <v-card-subtitle>
          <div>
            <v-row
              v-if="filterStatus()"
              justify="end"
            >
              Online&nbsp;
            </v-row>
            <v-row
              v-else
              justify="end"
              class="font-italic"
            >
              Offline ({{ lastConnectionSearchProfile }})&nbsp;
            </v-row>
            <div class="headline font-weight-bold purple--text text--accent-4">
              {{ loadedSearchProfile.username }}
            </div>
            <div class="title font-italic purple--text text--accent-3">
              {{ myGender[loadedSearchProfile.gender_id - 1] }} {{ loadedSearchProfile.age }} y/o
            </div>
            <div class="title font-italic purple--text text--accent-3">
              Interested in {{ genderLF[loadedSearchProfile.interested_in - 1] }}
            </div>
            <v-row justify="end">
              Score: {{ loadedSearchProfile.score }}&nbsp;
            </v-row>
          </div>
        </v-card-subtitle>

        <v-card-text class="text--primary">
          <div>&nbsp;</div>
          <div>{{ loadedSearchProfile.name }} {{ loadedSearchProfile.surname }}</div>
          <div>Anniversary: {{ birthdaySearchProfile }}</div>
          <div>&nbsp;</div>
          <div>Tags: {{ loadedSearchProfile.tags.toString() }}</div>
          <div>&nbsp;</div>
          <div>Description: {{ loadedSearchProfile.bio }}</div>
        </v-card-text>
        <v-card-text class="text--primary">
          <div
            v-if="loadedSearchProfile.location.country"
          >
            Country: {{ loadedSearchProfile.location.country }}
          </div>
          <div>City: {{ loadedSearchProfile.location.city }}</div>
          <div
            v-if="loadedSearchProfile.location.district"
          >
            District: {{ loadedSearchProfile.location.district }}
          </div>

          <v-card-actions>
            <v-row
              align-start
            >
              <v-col>
                <v-btn
                  @click="love"
                  fab
                  color="deep-purple lighten-5"
                  absolute
                  x-large
                >
                  <v-icon
                    color="deep-purple accent-3"
                  >
                    mdi-cards-heart
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  @click="dislike"
                  fab
                  color="deep-purple lighten-5"
                  absolute
                  x-large
                >
                  <v-icon
                    color="deep-purple accent-3"
                  >
                    mdi-heart-broken
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="2" />
              <v-col>
                <nuxt-link to="/">
                  <v-btn
                    @click="block"
                    fab
                    color="deep-purple lighten-5"
                    absolute
                    x-large
                  >
                    <v-icon
                      color="indigo accent-1"
                    >
                      mdi-account-cancel
                    </v-icon>
                  </v-btn>
                </nuxt-link>
              </v-col>

              <v-col>
                <v-btn
                  @click="report"
                  fab
                  color="deep-purple lighten-5"
                  absolute
                  x-large
                >
                  <v-icon
                    color="indigo accent-1"
                  >
                    mdi-alert-octagon-outline
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card-text>
      </v-card>
      <br><br>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import socket from '~/plugins/socket.io.js'

export default {
  middleware: 'authenticated',
  data () {
    return {
      // statusListener: {},
      target: this.$route.params.username,
      valid: true,
      myGender: ['Bi', 'Man', 'Woman'],
      genderLF: ['Men & Women', 'Men', 'Women']
    }
  },
  computed: {
    checker () {
      return this.$store.getters['user/checker']
    },
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    },
    loadedUsers () {
      return this.$store.getters['user/loadedUsers']
    },
    loadedSearchProfile () {
      return this.$store.getters['search/loadedSearchProfile']
    },
    token () {
      return this.$store.getters['user/token']
    },
    loadedLikes () {
      return this.$store.getters['interact/loadedLikes']
    }
  },
  async asyncData (context) {
    let birthdaySearchProfile = ''

    context.store.dispatch('user/setChecker', false)
    if (context.params.username !== context.store.getters['user/loadedUsers'].username) {
      await axios({
        method: 'post',
        url: process.env.serverUrl + '/social/view',
        data: {
          username: context.route.params.username
        },
        headers: {
          Authorization: 'Bearer ' + context.store.getters['user/token']
        }
      })
        .then((response) => {
          socket.emit('view', context.store.getters['user/loadedUsers'].username, context.route.params.username)
        })
        // eslint-disable-next-line
        .catch((error) => {
        })
      await axios
        .get(process.env.serverUrl + '/users/profile', {
          params: {
            username: context.route.params.username
          },
          headers: {
            Authorization: 'Bearer ' + context.app.store.getters['user/token']
          }
        })
        .then((response) => {
          context.store.dispatch('search/setSearchProfile', response.data.userdata)
          context.store.dispatch('user/setChecker', true)
        })
        // eslint-disable-next-line
        .catch((error) => {
          context.store.dispatch('search/deleteSearchProfile')
          context.redirect('/')
        })
      await axios
        .get(process.env.serverUrl + '/social/like', {
          headers: {
            Authorization: 'Bearer ' + context.app.store.getters['user/token']
          }
        })
        .then((response) => {
          context.store.dispatch('interact/setLikes', response.data.client)
        })
        // eslint-disable-next-line
        .catch((error) => {
        })
      birthdaySearchProfile = await moment(context.store.getters['search/loadedSearchProfile'].birth_date, 'YYYY-MM-DDTHH:mm:ss[Z]').format('Do MMMM')
      const lastConnectionSearchProfile = await moment(context.store.getters['search/loadedSearchProfile'].last_connection, 'YYYY-MM-DDTHH:mm:ss[Z]').format('L')
      return {
        birthdaySearchProfile,
        lastConnectionSearchProfile
      }
    } else {
      context.store.dispatch('search/deleteSearchProfile')
      context.redirect('/login/profile')
    }
  },
  methods: {
    love () {
      this.$store.dispatch('interact/sendLove', this.target)
    },
    dislike () {
      this.$axios({
        method: 'post',
        url: process.env.serverUrl + '/social/dislike',
        data: {
          username: this.target
        },
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['user/token']
        }
      })
        .then((response) => {
          if (response.data.client.includes('Disliked and unmatched')) {
            socket.emit('dislike', this.$store.getters['user/loadedUsers'].username, this.target)
          }
          this.$store.dispatch('interact/setMessage', 'Disliked !')
        })
        // eslint-disable-next-line
        .catch((error) => {
        })
    },
    block () {
      this.$axios({
        method: 'post',
        url: process.env.serverUrl + '/social/block',
        data: {
          username: this.target
        },
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['user/token']
        }
      })
        .then((response) => {
          this.$store.dispatch('search/deleteSuggestions', {})
          this.$store.dispatch('interact/setMessage', 'User blocked')
          this.$store.dispatch('search/getSuggestions')
        })
        // eslint-disable-next-line
        .catch((error) => {
        })
    },
    report () {
      this.$axios({
        method: 'post',
        url: process.env.serverUrl + '/social/report',
        data: {
          username: this.target
        },
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['user/token']
        }
      })
        .then((response) => {
          this.$store.dispatch('interact/setMessage', 'User reported')
        })
        // eslint-disable-next-line
        .catch((error) => {
        })
    },
    filterStatus () {
      return this.$store.getters['websocket/loadedStatus'][this.target]
    }
  }
}
</script>
