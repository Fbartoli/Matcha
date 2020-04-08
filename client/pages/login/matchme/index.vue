<template>
  <div>
    <div>
      <br>
      <v-container
        class="font-weight-black purple--text text--lighten-5"
      >
        Let's find the one !
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
                <v-radio-group
                  :rules="interestedinRules"
                  v-model="loadedUsers.interested_in"
                  row="row"
                  max="1"
                  label="I am interested in..."
                  disabled
                  readonly
                >
                  <v-radio :value="3" label="Women" />
                  <v-radio :value="2" label="Men" />
                  <v-radio :value="1" label="Both" />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-icon class="hidden-xs-only" right large>
                  mdi-flower
                </v-icon>
              </v-col>
              <v-col cols="10">
                <v-range-slider
                  v-model="ageValue"
                  :rules="ageRules"
                  :thumb-size="34"
                  track-fill-color="purple accent-4"
                  thumb-label="always"
                  thumb-color="indigo accent-2"
                  track-color="purple lighten-3"
                  min="18"
                  max="100"
                  label="Age"
                >
                  <v-text-field
                    :value="ageValue[0]"
                  />
                  <v-text-field
                    :value="ageValue[1]"
                  />
                </v-range-slider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-icon class="hidden-xs-only" right large>
                  mdi-map-marker-radius
                </v-icon>
              </v-col>
              <v-col cols="10">
                <v-slider
                  v-model="proximity"
                  :thumb-size="34"
                  :rules="distanceRules"
                  max="20000"
                  thumb-label="always"
                  thumb-color="deep-purple accent-3"
                  label="Distance (km)"
                  track-color="purple lighten-3"
                  track-fill-color="purple accent-4"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-icon class="hidden-xs-only" right large>
                  mdi-star-circle
                </v-icon>
              </v-col>
              <v-col cols="10">
                <v-range-slider
                  v-model="scoreValue"
                  :rules="scoreRules"
                  :thumb-size="34"
                  track-fill-color="purple accent-4"
                  thumb-label="always"
                  thumb-color="light-blue darken-2"
                  track-color="purple lighten-3"
                  min="0"
                  max="1000"
                  label="Popularity"
                >
                  <v-text-field
                    :value="scoreValue[0]"
                  />
                  <v-text-field
                    :value="scoreValue[1]"
                  />
                </v-range-slider>
              </v-col>
            </v-row>
            <v-row
              style="background-color: rgba(0, 0, 0, 0)"
            >
              <v-col cols="1">
                <v-icon class="hidden-xs-only" right large>
                  mdi-pound-box
                </v-icon>
              </v-col>
              <v-col cols="10">
                <v-select
                  v-model="tags"
                  :items="hobbies"
                  attach
                  chips
                  label="Tags"
                  multiple
                />
              </v-col>
            </v-row>
            <br>
            <v-row>
              <v-col>
                <v-btn
                  @click="matchme"
                  :disabled="!valid"
                  color="blue lighten-5"
                  class="mr-4"
                >
                  FIND the one ! &nbsp;
                  <v-icon>
                    mdi-book-open-page-variant
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </div>
      <br>
    </div>
    <div v-if="checker === true">
      <v-container
        v-if="loadedUsers.profile_complete === 1 && token"
      >
        <v-carousel
          :hide-delimiters="true"
          continuous
        >
          <v-carousel-item
            v-for="(itemAdvancedSearch, filterKey) in filterAdvancedSearch(loadedAdvancedSearch)"
            :key="filterKey"
            reverse-transition="fade-transition"
          >
            <nuxt-link
              :to="{ path: `/login/user/${itemAdvancedSearch.username}` }"
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
                          {{ itemAdvancedSearch.username }}
                        </div>
                        <div class="title font-italic purple--text text--accent-3">
                          {{ myGender[itemAdvancedSearch.gender_id - 1] }} {{ itemAdvancedSearch.age }} y/o
                        </div>
                        <div class="title font-italic purple--text text--accent-3">
                          Interested in {{ genderLF[itemAdvancedSearch.interested_in - 1] }}
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
                            :src="`data:image/*;base64,${itemAdvancedSearch.photo[0]}`"
                          />
                        </v-avatar>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row justify="end">
                    Score: {{ itemAdvancedSearch.score }}&nbsp;
                  </v-row>
                  <v-card-text class="purple--text text--lighten-5">
                    <div>Tags: {{ itemAdvancedSearch.hobbies.toString() }}</div>
                  </v-card-text>
                  <v-card-text class="purple--text text--lighten-5">
                    <div
                      v-if="itemAdvancedSearch.location.country"
                    >
                      Country: {{ itemAdvancedSearch.location.country }}
                    </div>
                    <div>City: {{ itemAdvancedSearch.location.city }}</div>
                    <div
                      v-if="itemAdvancedSearch.location.district"
                    >
                      District: {{ itemAdvancedSearch.location.district }}
                    </div>
                    <div>
                      Distance: {{ itemAdvancedSearch.distance }} km
                    </div>
                  </v-card-text>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    @click="love(itemAdvancedSearch.username)"
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'authenticated',
  data () {
    return {
      valid: true,
      ageValue: [18, 100],
      proximity: 4200,
      scoreValue: [0, 1000],
      tags: [],
      hobbies: ['#gamer', '#surfer', '#hacker', '#starwars', '#meditation', '#42', '#geek', '#fashion', '#hipster', '#horse', '#vegan', '#meat', '#', '#coding', '#C', '#python', '#anime', '#yachting', '#matcha', '#macron'],
      myGender: ['Bi', 'Man', 'Woman'],
      genderLF: ['Men & Women', 'Men', 'Women'],
      filterAge: [18, 100],
      filterDistance: 20000,
      filterScore: [0, 1000],
      filterTags: '',
      orderByChoice: '',
      orderByList: ['Age', 'Popularity', 'Distance', 'Tags'],
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
      ],
      interestedinRules: [
        v => !!v || 'Target gender required',
        v => (v > 0 && v < 4) || 'Pick one of the 3 target gender choices',
        v => /[0-9]+/.test(v) || 'Use the slider to pick a value'
      ]
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
    },
    checker () {
      return this.$store.getters['user/checker']
    },
    loadedAdvancedSearch () {
      return this.$store.getters['search/loadedAdvancedSearch']
    }
  },
  methods: {
    matchme () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('user/setChecker', false)
        axios
          .get(process.env.serverUrl + '/social/search', {
            params: {
              age: this.ageValue.toString(),
              popularity: this.scoreValue.toString(),
              distance: this.proximity,
              tags: this.tags.toString(),
              gender: this.loadedUsers.interested_in
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.getters['user/token']
            }
          })
          .then((response) => {
            if (response.data.client.length === 0) {
              this.$store.dispatch('interact/setMessage', 'No result matching your criteria, try to broaden your horizon !')
            } else {
              this.$store.dispatch('search/setAdvancedSearch', response.data.client)
              this.$store.dispatch('user/setChecker', true)
              this.$store.dispatch('interact/setMessage', "Let's find the One ! ~~")
            }
          })
          // eslint-disable-next-line
          .catch((error) => {
          })
      }
    },
    filterAdvancedSearch (itemFilterAdvancedSearch) {
      const self = this
      return itemFilterAdvancedSearch.filter(function (itemFilterAdvancedSearch) {
        if (self.filterDistance) {
          return itemFilterAdvancedSearch.distance <= self.filterDistance && itemFilterAdvancedSearch.hobbies.includes(self.filterTags) && itemFilterAdvancedSearch.age >= self.filterAge[0] && itemFilterAdvancedSearch.age <= self.filterAge[1] && itemFilterAdvancedSearch.score >= self.filterScore[0] && itemFilterAdvancedSearch.score <= self.filterScore[1]
        }
      })
        .sort(function compare (user1, user2) {
          if (self.orderByChoice === 'Age') {
            if (user1.age <= user2.age) {
              return -1
            }
            if (user1.age > user2.age) {
              return 1
            }
          }
          if (self.orderByChoice === 'Popularity') {
            if (user1.score <= user2.score) {
              return -1
            }
            if (user1.score > user2.score) {
              return 1
            }
          }
          if (self.orderByChoice === 'Distance') {
            if (user1.distance <= user2.distance) {
              return -1
            }
            if (user1.distance > user2.distance) {
              return 1
            }
          }
          if (self.orderByChoice === 'Tags') {
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
