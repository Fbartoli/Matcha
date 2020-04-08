<template>
  <div>
    <v-container
      class="font-weight-black purple--text text--lighten-5"
    >
      My Likes
    </v-container>
    <v-container style="background-color: transparent">
      <v-list style="background-color: transparent">
        <v-list-item
          v-for="(itemLikes, y) in filterLikes(loadedLikes)"
          :key="y"
        >
          <nuxt-link
            :to="{ path: `/login/user/${itemLikes.user_who_likes}` }"
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
                    mdi-heart-half-full
                  </v-icon>
                  {{ itemLikes.user_who_likes }} liked your profile {{ itemLikes.loveAge }} ({{ itemLikes.loveDate }})
                </v-list-item-title>
              </p>
            </div>
          </nuxt-link>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  middleware: 'authenticated',
  data () {
    return {
      valid: true
    }
  },
  computed: {
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    },
    loadedLikes () {
      return this.$store.getters['interact/loadedLikes']
    },
    token () {
      return this.$store.getters['user/token']
    }
  },
  async asyncData (context) {
    const myLikes = await axios
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
    return {
      myLikes
    }
  },
  methods: {
    filterLikes (loves) {
      return loves.received.filter(function (love) {
        love.loveAge = moment(love.date, 'YYYY-MM-DDTHH:mm:ss[Z]').fromNow()
        love.loveDate = moment(love.date, 'YYYY-MM-DDTHH:mm:ss[Z]').format('MMMM Do YYYY, h:mm:ss a')
        return love
      })
    }
  }
}
</script>
