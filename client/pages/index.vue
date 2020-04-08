<template>
  <div>
    <v-container
      v-if="loadedUsers.profile_complete === 1 && token && loadedSuggestions[0]"
    >
      <v-carousel
        :hide-delimiters="true"
        continuous
        height="550px"
      >
        <v-carousel-item
          v-for="(itemSuggestions, filterIndex) in filterSuggestions(loadedSuggestions)"
          :key="filterIndex"
          reverse-transition="fade-transition"
        >
          <nuxt-link
            :to="{ path: `/login/user/${itemSuggestions.username}` }"
          >
            <v-card
              :hover="true"
              v-ripple="{ class: `purple--text` }"
              class="mx-auto"
              max-width="420"
            >
              <v-card-subtitle>
                <v-row>
                  <v-col cols="8">
                    <div>
                      <div class="headline font-weight-bold purple--text text--accent-4">
                        {{ itemSuggestions.username }}
                      </div>
                      <div class="title font-italic purple--text text--accent-3">
                        {{ myGender[itemSuggestions.gender_id - 1] }} {{ itemSuggestions.age }} y/o
                      </div>
                      <div class="title font-italic purple--text text--accent-3">
                        Interested in {{ genderLF[itemSuggestions.interested_in - 1] }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div>
                      <v-avatar
                        class="profile indigo accent-4"
                        size="96"
                      >
                        <v-img
                          :src="`data:image/*;base64,${itemSuggestions.photo}`"
                        />
                      </v-avatar>
                    </div>
                  </v-col>
                </v-row>
                <v-row justify="end">
                  Score: {{ itemSuggestions.score }}&nbsp;
                </v-row>
                <v-card-text class="purple--text text--lighten-5">
                  <div>{{ itemSuggestions.name }} {{ itemSuggestions.surname }}</div>
                  <div>Tags: {{ itemSuggestions.hobbies.toString() }}</div>
                </v-card-text>
                <v-card-text class="purple--text text--lighten-5">
                  <div
                    v-if="itemSuggestions.location.country"
                  >
                    Country: {{ itemSuggestions.location.country }}
                  </div>
                  <div>City: {{ itemSuggestions.location.city }}</div>
                  <div
                    v-if="itemSuggestions.location.district"
                  >
                    District: {{ itemSuggestions.location.district }}
                  </div>
                  <div>
                    Distance: {{ itemSuggestions.distance }} km
                  </div>
                </v-card-text>
              </v-card-subtitle>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  @click="love(itemSuggestions.username)"
                  fab
                  color="pink lighten-3"
                  bottom
                  left
                  absolute
                  x-large
                >
                  <v-icon>mdi-cards-heart</v-icon>
                </v-btn>
                <v-btn
                  color="purple"
                  text
                />
              </v-card-actions>
            </v-card>
          </nuxt-link>
        </v-carousel-item>
      </v-carousel>
    </v-container>
    <v-container v-if="loadedSuggestions[0]">
      <v-row>
        <v-col cols="1" />
        <v-col cols="4">
          <v-row>
            <v-select
              v-model.lazy="orderByChoice"
              :items="orderByList"
              label="OrderBy"
              outlined
            />
          </v-row>
        </v-col>
        <v-col cols="1" />
        <v-col cols="4">
          <v-row>
            <v-select
              v-model.lazy="filterTags"
              :items="hobbies"
              label="FilterBy Tag"
              outlined
            />
          </v-row>
        </v-col>
        <v-col cols="1" />
      </v-row>
      <v-row>
        <v-col cols="11">
          <v-row>
            <v-range-slider
              v-model.lazy="filterAge"
              :thumb-size="32"
              :rules="ageRules"
              thumb-label="always"
              track-fill-color="purple accent-4"
              thumb-color="indigo darken-3"
              track-color="purple lighten-3"
              min="18"
              max="100"
              label="Filter by Age"
            >
              <v-text-field
                :value="filterAge[0]"
              />
              <v-text-field
                :value="filterAge[1]"
              />
            </v-range-slider>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="11">
          <v-row>
            <v-slider
              v-model.lazy="filterDistance"
              :thumb-size="32"
              :rules="distanceRules"
              max="20000"
              thumb-label="always"
              thumb-color="deep-purple accent-3"
              label="Filter by Distance (km)"
              track-color="purple lighten-3"
              track-fill-color="purple accent-4"
            />
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="11">
          <v-row>
            <v-range-slider
              v-model="filterScore"
              :rules="scoreRules"
              :thumb-size="34"
              track-fill-color="purple accent-4"
              thumb-label="always"
              thumb-color="indigo accent-2"
              track-color="purple lighten-3"
              min="0"
              max="1000"
              label="Filter by Popularity"
            >
              <v-text-field
                :value="filterScore[0]"
              />
              <v-text-field
                :value="filterScore[1]"
              />
            </v-range-slider>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-container
      v-else
      justify-center
      align-center
    >
      <BigHeartLogo />
      <h1 class="display-3 font-italic font-weight-medium text-center ">
        <br><br>Matcha<br><br>
      </h1>
      <h2 class="display-2 font-italic font-weight-light text-center">
        The lovely dating platform !
      </h2>
    </v-container>
    <v-container>
      <div class="overline display-2 text-center">
        <br><br>Let's find The One ~~<br>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import BigHeartLogo from '~/components/layout/BigHeartLogo.vue'

export default {
  components: {
    BigHeartLogo
  },
  data () {
    return {
      loading: true,
      myGender: ['Bi', 'Man', 'Woman'],
      genderLF: ['Men & Women', 'Men', 'Women'],
      hobbies: ['#gamer', '#surfer', '#hacker', '#starwars', '#meditation', '#42', '#geek', '#fashion', '#hipster', '#horse', '#vegan', '#meat', '#', '#coding', '#C', '#python', '#anime', '#yachting', '#matcha', '#macron'],
      filterAge: [18, 100],
      filterDistance: 20000,
      filterScore: [0, 1000],
      filterTags: '',
      orderByChoice: 'Auto',
      orderByList: ['Auto', 'Age', 'Popularity', 'Distance', 'Tags'],
      ageRules: [
        v => !!v || 'Target age required',
        v => (v[1] < 101) || 'Target age too high',
        v => (v[0] > 17) || 'Target age minimum is 18',
        v => (/[0-9]+/.test(v[0]) && /[0-9]+/.test(v[1])) || 'Use the slider to pick a value'
      ],
      scoreRules: [
        v => !!v || 'Target popularity required',
        v => (v[1] < 1001) || 'Target popularity max too high',
        v => (v[0] >= 0) || 'Target popularity minimum is 0',
        v => (/[0-9]+/.test(v[0]) && /[0-9]+/.test(v[1])) || 'Use the slider to pick a value'
      ],
      distanceRules: [
        v => !!v || 'Target distance required',
        v => (v < 20001) || 'Distance max is 20 000 km',
        v => (v >= 0) || 'Distance minimum is 0 km',
        v => /[0-9]+/.test(v) || 'Use the slider to pick a value'
      ]
    }
  },
  computed: {
    // checker () {
    //   return this.$store.getters['user/checker']
    // },
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    },
    loadedMapPosition () {
      return this.$store.getters['geoloc/loadedMapPosition']
    },
    loadedLocation () {
      return this.$store.getters['geoloc/loadedLocation']
    },
    loadedUsers () {
      return this.$store.getters['user/loadedUsers']
    },
    token () {
      return this.$store.getters['user/token']
    },
    loadedSuggestions () {
      return this.$store.getters['search/loadedSuggestions']
    }
  },
  async asyncData (context) {
    // eslint-disable-next-line
    const options = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000
    }

    function success (position) {
      const userAcceptsGeoloc = position.coords
      const location = {}
      location.lat = userAcceptsGeoloc.latitude
      location.lng = userAcceptsGeoloc.longitude
      const accuracy = userAcceptsGeoloc.accuracy
      context.store.dispatch('geoloc/setMapPosition', { accuracy, location })
      context.store.dispatch('geoloc/setReverseGeoloc')
    }
    // eslint-disable-next-line
    function error (error) {
      context.store.dispatch('geoloc/setIpGeoloc')
    }

    if (context.app.store.getters['user/token'] && !context.app.store.getters['geoloc/loadedLocation'].city) {
      // geolocalisation process
      if ('geolocation' in navigator) {
        await navigator.geolocation.getCurrentPosition(success, error, options)
      }
    }
    if (context.app.store.getters['user/token'] !== null) {
      if (!context.app.store.getters['search/loadedSuggestions'][0]) {
        context.app.store.dispatch('search/getSuggestions')
      }
      await axios
        .get(process.env.serverUrl + '/social/notification', {
          headers: {
            Authorization: 'Bearer ' + context.app.store.getters['user/token']
          }
        })
        .then((response) => {
          context.store.dispatch('websocket/setNotifications', response.data.client)
        })
        // eslint-disable-next-line
        .catch((error) => {
        })
      await axios
        .get(process.env.serverUrl + '/users/photos', {
          headers: {
            Authorization: 'Bearer ' + context.app.store.getters['user/token']
          }
        })
        .then((response) => {
          context.store.dispatch('user/setPictures', response.data.client)
        })
        // eslint-disable-next-line
        .catch((error) => {
        })
    }
  },
  methods: {
    filterSuggestions (itemFilterSuggestions) {
      const selfThis = this
      return itemFilterSuggestions.filter(function (itemFilterSuggestions) {
        if (selfThis.filterDistance) {
          return itemFilterSuggestions.distance <= selfThis.filterDistance && itemFilterSuggestions.hobbies.includes(selfThis.filterTags) && itemFilterSuggestions.age >= selfThis.filterAge[0] && itemFilterSuggestions.age <= selfThis.filterAge[1] && itemFilterSuggestions.score >= selfThis.filterScore[0] && itemFilterSuggestions.score <= selfThis.filterScore[1]
        }
      })
        .sort(function compare (user1, user2) {
          if (selfThis.orderByChoice === 'Auto') {
            if (user1.matchScore <= user2.matchScore) {
              return -1
            }
            if (user1.matchScore > user2.matchScore) {
              return 1
            }
          }
          if (selfThis.orderByChoice === 'Age') {
            if (user1.age <= user2.age) {
              return -1
            }
            if (user1.age > user2.age) {
              return 1
            }
          }
          if (selfThis.orderByChoice === 'Popularity') {
            if (user1.score <= user2.score) {
              return -1
            }
            if (user1.score > user2.score) {
              return 1
            }
          }
          if (selfThis.orderByChoice === 'Distance') {
            if (user1.distance <= user2.distance) {
              return -1
            }
            if (user1.distance > user2.distance) {
              return 1
            }
          }
          if (selfThis.orderByChoice === 'Tags') {
            if (user1.hobbies <= user2.hobbies) {
              return -1
            }
            if (user1.hobbies > user2.hobbies) {
              return 1
            }
          }
        })
    },
    love (target) {
      this.$store.dispatch('interact/sendLove', target)
    }
  }
}
</script>

<style scoped>

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  font-size: 100px;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
}

.links {
  padding-top: 15px;
}
</style>
