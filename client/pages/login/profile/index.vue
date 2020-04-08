<template>
  <div>
    <br><v-divider /><br>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-row
            justify="center"
          >
            <nuxt-link to="/login/profile/mypics">
              <v-btn
                color="purple accent-3"
                dark
              >
                My Pics
                &nbsp;
                <v-icon>
                  mdi-camera
                </v-icon>
              </v-btn>
            </nuxt-link>
          </v-row>
        </v-col>
        <v-col>
          <v-row
            justify="center"
          >
            <nuxt-link to="/login/profile/mygeoloc">
              <v-btn
                color="cyan lighten-2"
                dark
              >
                My geoLoc
                &nbsp;
                <v-icon>
                  mdi-compass
                </v-icon>
              </v-btn>
            </nuxt-link>
          </v-row>
        </v-col>
        <v-col>
          <v-row
            justify="center"
          >
            <nuxt-link to="/login/profile/settings">
              <v-btn
                color="indigo lighten-2"
                dark
              >
                Settings
                &nbsp;
                <v-icon>
                  mdi-settings
                </v-icon>
              </v-btn>
            </nuxt-link>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <br><v-divider /><br>
    <v-container
      class="font-weight-black purple--text text--lighten-5"
      style="display: flex; justify-content: center;"
    >
      My profile page
    </v-container>
    <v-card
      :hover="true"
      class="mx-auto"
      max-width="434"
    >
      <v-img
        :src="`data:image/*;base64,${loadedPictures[1]}`"
        aspect-ratio="2"
        class="blue lighten-2"
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
                :src="`data:image/*;base64,${loadedPictures[0]}`"
              />
            </v-avatar>
          </v-col>
        </v-row>
      </v-img>
      <v-card-subtitle>
        <div>
          <div class="headline font-weight-bold purple--text text--accent-4">
            {{ loadedUsers.username }}
          </div>
          <div class="title font-italic purple--text text--accent-3">
            {{ myGender[loadedUsers.gender_id - 1] }} {{ loadedUsers.age }} y/o
          </div>
          <div class="title font-italic purple--text text--accent-3">
            Interested in {{ genderLF[loadedUsers.interested_in - 1] }}
          </div>
          <v-row justify="end">
            Score: {{ loadedUsers.score }}&nbsp;
          </v-row>
        </div>
      </v-card-subtitle>
      <v-card-text class="text--primary">
        <div>&nbsp;</div>
        <div>{{ loadedUsers.name }} {{ loadedUsers.surname }}</div>
        <div>Anniversary: {{ birthdayProfile }}</div>
        <div>&nbsp;</div>
        <div
          v-if="loadedUsers.tags"
        >
          Tags: {{ loadedUsers.tags.toString() }}
        </div>
        <div>&nbsp;</div>
        <div>Description: {{ loadedUsers.bio }}</div>
      </v-card-text>
      <v-card-text class="text--primary">
        <div
          v-if="loadedLocation.country"
        >
          Country: {{ loadedLocation.country }}
        </div>
        <div>City: {{ loadedLocation.city }}</div>
        <div
          v-if="loadedLocation.district"
        >
          District: {{ loadedLocation.district }}
        </div>
      </v-card-text>
      <v-carousel
        continuous
        height="20vh"
      >
        <v-carousel-item
          v-for="(itemProfile,z) in loadedPictures"
          :key="z"
          :src="`data:image/*;base64,${itemProfile}`"
          v-ripple="{ class: `purple--text` }"
          reverse-transition="fade-transition"
        />
      </v-carousel>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

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
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    },
    loadedUsers () {
      return this.$store.getters['user/loadedUsers']
    },
    loadedPictures () {
      return this.$store.getters['user/loadedPictures']
    },
    token () {
      return this.$store.getters['user/token']
    },
    loadedLocation () {
      return this.$store.getters['geoloc/loadedLocation']
    }
  },
  // async asyncData (context) {
  //   const birthday = await moment(context.store.getters['user/loadedUsers'].birth_date, 'YYYY-MM-DD').format('Do MMMM')
  //   return {
  //     birthday
  //   }
  // },
  async asyncData (context) {
    const usermypics = await axios
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
    const userprofile = await axios
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
    const birthdayProfile = await moment(context.store.getters['user/loadedUsers'].birth_date, 'YYYY-MM-DDTHH:mm:ss[Z]').format('Do MMMM')
    return {
      usermypics,
      userprofile,
      birthdayProfile
    }
  }
}
</script>
