<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-row
            justify="center"
          >
            <nuxt-link to="/login/mycrush/mylikes">
              <v-btn
                color="deep-purple accent-3"
                dark
              >
                My Likes
                &nbsp;
                <v-icon>
                  mdi-heart
                </v-icon>
              </v-btn>
            </nuxt-link>
          </v-row>
        </v-col>
        <v-col>
          <v-row
            justify="center"
          >
            <nuxt-link to="/login/mycrush/notifications">
              <v-btn
                color="pink darken-4"
                dark
              >
                Notifications
                &nbsp;
                <v-icon>
                  mdi-message-alert
                </v-icon>
              </v-btn>
            </nuxt-link>
          </v-row>
        </v-col>
        <v-col>
          <v-row
            justify="center"
          >
            <nuxt-link to="/login/mycrush/myviews">
              <v-btn
                color="indigo accent-2"
                dark
              >
                My Views
                &nbsp;
                <v-icon>
                  mdi-bullseye-arrow
                </v-icon>
              </v-btn>
            </nuxt-link>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-container
      class="font-weight-black purple--text text--lighten-5"
    >
      My crushes
    </v-container>
    <v-container style="background-color: transparent">
      <v-list
        v-if="loadedMatchList === []"
        style="background-color: transparent"
      />
      <v-list
        v-else
        style="background-color: transparent"
      >
        <v-list-item
          v-for="(itemMatchs, a) in loadedMatchList"
          :key="a"
        >
          <div>
            <p
              class="text-xs-right"
            >
              <v-list-item-title
                class="purple--text text--lighten-5 text-xs-left"
              >
                <v-icon
                  class="purple--text text--lighten-5"
                >
                  mdi-heart
                </v-icon>
                <nuxt-link
                  :to="{ path: `/login/user/${itemMatchs.username}` }"
                  class="subtitle-1"
                >
                  {{ itemMatchs.username }}
                </nuxt-link>
                <v-icon
                  class="purple--text text--lighten-5"
                >
                  mdi-heart
                </v-icon>
                <i class="font-weight-light">may be the one !&nbsp;&nbsp;&nbsp;</i>
                <nuxt-link :to="{ path: `/login/chat/${itemMatchs.username}` }">
                  <v-btn
                    color="teal accent-3"
                  >
                    <v-icon
                      class="purple--text text--lighten-5"
                    >
                      mdi-forum
                    </v-icon>
                  </v-btn>
                </nuxt-link>
              </v-list-item-title>
            </p>
          </div>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'authenticated',
  data () {
    return {
      valid: true,
      myGender: ['Bi', 'Man', 'Woman'],
      genderLF: ['Men & Women', 'Men', 'Women']
    }
  },
  computed: {
    // checker () {
    //   return this.$store.getters['user/checker']
    // },
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    },
    loadedSuggestions () {
      return this.$store.getters['search/loadedSuggestions']
    },
    loadedMatchList () {
      return this.$store.getters['search/loadedMatchList']
    },
    token () {
      return this.$store.getters['user/token']
    }
  },
  async asyncData (context) {
    const matchList = await axios
      .get(process.env.serverUrl + '/social/match', {
        headers: {
          'Authorization': 'Bearer ' + context.app.store.getters['user/token']
        }
      })
      .then((response) => {
        if (response.data.client.length !== 0) {
          context.store.dispatch('search/setMatchList', response.data.client)
        } else {
          context.store.dispatch('interact/setMessage', 'No match so far')
        }
      })
      // eslint-disable-next-line
      .catch((error) => {
      })
    return {
      matchList
    }
  },
  methods: {
    love (target) {
      // eslint-disable-next-line
      this.$axios({
        method: 'post',
        url: process.env.serverUrl + '/social/like',
        data: {
          username: target
        },
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['user/token']
        }
      })
        .then((response) => {
        })
        // eslint-disable-next-line
        .catch((error) => {
        })
    }
  }
}
</script>
