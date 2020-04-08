<template>
  <div>
    <v-container
      class="font-weight-black"
    >
      <v-row>
        <v-col>
          <v-row
            justify="center"
          >
            <v-btn
              @click="googleAPI"
              color="blue lighten-4"
              class="mr-4"
            >
              Update My GeoLocalisation now !
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
      <br>
      <v-card
        class="overflow-hidden"
        color="purple lighten-1"
        dark
      >
        <v-toolbar
          flat
          color="purple"
        >
          <v-icon>mdi-city</v-icon>
          <v-toolbar-title
            class="font-weight-light"
          >
            &nbsp;Choose a place manually
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            @click="isEditing = !isEditing"
            color="purple darken-3"
            fab
            small
          >
            <v-icon
              v-if="isEditing"
            >
              mdi-close
            </v-icon>
            <v-icon
              v-else
            >
              mdi-pencil
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-autocomplete
            v-model="chosenCity"
            :disabled="!isEditing"
            :items="cities"
            :filter="customFilter"
            auto-select-first
            color="white"
            item-text="name"
            label="City of your choice"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="save"
            :disabled="!isEditing"
            color="purple accent-1"
          >
            Save
          </v-btn>
        </v-card-actions>
        <v-snackbar
          v-model="hasSaved"
          :timeout="2442"
          absolute
          bottom
          left
        >
          Location saved
        </v-snackbar>
      </v-card>
    </v-container>
    <div>
      <br>
      <v-row>
        <v-col>
          <v-row
            align="center"
            justify="center"
          >
            <v-img
              :src="`https://maps.googleapis.com/maps/api/staticmap?center=${loadedMapPosition.lat},${loadedMapPosition.lng}&zoom=14&size=1920x1080&key=AIzaSyBu0mWRiUcEUYjd2YWcrMctTPNynrlGGi4`"
              v-if="loadedMapPosition.lat && loadedMapPosition.lng"
              max-height="50%"
              max-width="90%"
              aspect-ratio="1.7778"
            />
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  middleware: 'authenticated',
  data () {
    return {
      valid: true,
      hasSaved: false,
      isEditing: null,
      model: null,
      chosenCity: {},
      cities: [
        { name: 'Paris', abbr: '42', value: { accuracy: '1', lat: '48.8580516', lng: '2.3347066', country: 'France', city: 'Paris' }, id: 1 },
        { name: 'Lyon', abbr: 'LYS', value: { accuracy: '1', lat: '45.7627609', lng: '4.8277086', country: 'France', city: 'Lyon' }, id: 2 },
        { name: 'Grenoble', abbr: 'VH', value: { accuracy: '1', lat: '45.1877082', lng: '5.7212843', country: 'France', city: 'Grenoble' }, id: 3 },
        { name: 'Bordeaux', abbr: 'BOD', value: { accuracy: '1', lat: '44.8392298', lng: '-0.5798865', country: 'France', city: 'Bordeaux' }, id: 4 },
        { name: 'Rouen', abbr: 'RBS', value: { accuracy: '1', lat: '49.4409468', lng: '1.1029098', country: 'France', city: 'Rouen' }, id: 5 },
        { name: 'Strasbourg', abbr: 'Choucroute', value: { accuracy: '1', lat: '48.5752061', lng: '7.7515292', country: 'France', city: 'Strasbourg' }, id: 6 },
        { name: 'New York', abbr: 'USA', value: { accuracy: '1', lat: '40.7010353', lng: '-74.0122313', country: 'United States of America', city: 'New York' }, id: 7 },
        { name: 'San Francisco', abbr: 'USA', value: { accuracy: '1', lat: '37.7542106', lng: '-122.4407429', country: 'United States of America', city: 'San Francisco' }, id: 8 },
        { name: 'Washington', abbr: 'USA', value: { accuracy: '1', lat: '38.8927292', lng: '-77.0412605', country: 'United States of America', city: 'Washington' }, id: 9 },
        { name: 'Singapore', abbr: 'CAG', value: { accuracy: '1', lat: '1.3439166', lng: '103.7538336', country: 'Singapore', city: 'Singapore' }, id: 10 },
        { name: 'Tokyo', abbr: 'HND', value: { accuracy: '1', lat: '35.6681621', lng: '139.6004425', country: 'Japan', city: 'Tokyo' }, id: 11 },
        { name: 'Osaka', abbr: 'ITM', value: { accuracy: '1', lat: '34.677623', lng: '135.4158533', country: 'Japan', city: 'Osaka' }, id: 12 },
        { name: 'London', abbr: 'UK', value: { accuracy: '1', lat: '51.5184663', lng: '-0.1833493', country: 'United Kingdom', city: 'London' }, id: 13 },
        { name: 'Manchester', abbr: 'UK', value: { accuracy: '1', lat: '53.4783887', lng: '-2.2435788', country: 'United Kingdom', city: 'Manchester' }, id: 14 },
        { name: 'Liverpool', abbr: 'UK', value: { accuracy: '1', lat: '53.4135672', lng: '-2.9767573', country: 'United Kingdom', city: 'Liverpool' }, id: 15 }
      ]
      // location: {
      //   lat: '',
      //   lng: ''
      // },
      // accuracy: ''
    }
  },
  computed: {
    serverMessage () {
      return this.$store.getters['interact/serverMessage']
    },
    loadedMapPosition () {
      return this.$store.getters['geoloc/loadedMapPosition']
    },
    loadedLocation () {
      return this.$store.getters['geoloc/loadedLocation']
    }
  },
  methods: {
    googleAPI () {
      const self = this
      const options = {
        enableHighAccuracy: true,
        // amount of time before the error callback is invoked
        timeout: 5000,
        // maximum cached position age
        maximumAge: 60000
      }
      function success (position) {
        const userAcceptsGeoloc = position.coords
        const location = {}
        location.lat = userAcceptsGeoloc.latitude
        location.lng = userAcceptsGeoloc.longitude
        const accuracy = userAcceptsGeoloc.accuracy
        self.$store.dispatch('geoloc/setMapPosition', { accuracy, location })
        self.$store.dispatch('geoloc/setReverseGeoloc')
      }
      // eslint-disable-next-line
      function error (error) {
        self.geolocIP()
      }
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, options)
      } else {
        self.geolocIP()
      }
    },
    geolocIP () {
      this.$axios({
        method: 'post',
        url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB2gxSBdA8xQ41FO66wPud8xJa1GIArZgU',
        data: {
          considerIp: 'true'
        }
      })
        .then((response) => {
          this.$store.dispatch('interact/setMessage', response.statusText)
          this.$store.dispatch('geoloc/setMapPosition', response.data)
          this.$store.dispatch('geoloc/setReverseGeoloc')
        })
      // eslint-disable-next-line
        .catch((error) => {
        })
    },
    customFilter (itemCustomFilter, queryText, itemText) {
      const textOne = itemCustomFilter.name.toLowerCase()
      const textTwo = itemCustomFilter.value.country.toLowerCase()
      const textThree = itemCustomFilter.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) > -1 ||
        textTwo.includes(searchText) > -1 ||
        textThree.includes(searchText) > -1
    },
    save () {
      this.isEditing = !this.isEditing
      this.hasSaved = true
      this.$store.dispatch('geoloc/setMapPosition', { accuracy: this.chosenCity.accuracy, location: { lat: parseFloat(this.chosenCity.lat), lng: parseFloat(this.chosenCity.lng) } })
      this.$store.dispatch('geoloc/setLocation', { address: { country: this.chosenCity.country, city: this.chosenCity.city, city_district: 'City center' } })
      this.$store.dispatch('geoloc/sendGeoloc')
    }
  }
}
</script>
