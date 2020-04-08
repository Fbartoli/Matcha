<template>
  <div>
    <v-container
      class="font-weight-black purple--text text--lighten-5"
    >
      My views
    </v-container>
    <v-container style="background-color: transparent">
      <v-list style="background-color: transparent">
        <v-list-item
          v-for="(itemViews, x) in filterViews(loadedViews)"
          :key="x"
        >
          <nuxt-link
            :to="{ path: `/login/user/${itemViews.user_who_views}` }"
          >
            <v-list-item-title
              class="purple--text text--lighten-5"
            >
              <v-icon
                class="purple--text text--lighten-5"
              >
                mdi-target-account
              </v-icon>
              {{ itemViews.user_who_views }} viewed your profile {{ itemViews.viewAge }} ({{ itemViews.viewDate }})
            </v-list-item-title>
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
    loadedViews () {
      return this.$store.getters['interact/loadedViews']
    },
    token () {
      return this.$store.getters['user/token']
    }
  },
  async asyncData (context) {
    const myViews = await axios
      .get(process.env.serverUrl + '/social/view', {
        headers: {
          Authorization: 'Bearer ' + context.app.store.getters['user/token']
        }
      })
      .then((response) => {
        context.store.dispatch('interact/setViews', response.data.client)
      })
      // eslint-disable-next-line
      .catch((error) => {
      })
    return {
      myViews
    }
  },
  methods: {
    filterViews (views) {
      return views.filter(function (view) {
        view.viewAge = moment(view.date, 'YYYY-MM-DDTHH:mm:ss[Z]').fromNow()
        view.viewDate = moment(view.date, 'YYYY-MM-DDTHH:mm:ss[Z]').format('MMMM Do YYYY, h:mm:ss a')
        return view
      })
    }
  }
}
</script>
