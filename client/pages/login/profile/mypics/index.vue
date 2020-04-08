<template>
  <div>
    <v-container
      class="font-weight-black purple--text text--lighten-5"
      style="display: flex; justify-content: center;"
    >
      Update your pictures<br>
    </v-container>
    <div>
      <div>
        <v-form
          id="myForm"
          ref="mypicsform"
          v-model="valid"
          lazy-validation
        >
          <v-container>
            <br><br>
            <v-row>
              <v-file-input
                @change="displayImage(uploadPics.mypics1, 0)"
                :rules="mypicsRules"
                v-model="uploadPics.mypics1"
                accept="image/*"
                counter
                show-size
                prepend-icon="mdi-camera"
                placeholder="Profile Picture"
                label="Profile Picture"
                truncate-length="42"
              />
            </v-row>
            <v-row>
              <v-file-input
                @change="displayImage(uploadPics.mypics2, 1)"
                :rules="mypicsRules"
                v-model="uploadPics.mypics2"
                accept="image/*"
                counter
                show-size
                prepend-icon="mdi-camera"
                placeholder="Landscape Picture"
                label="Landscape Picture"
                truncate-length="42"
              />
            </v-row>
            <v-row>
              <v-file-input
                @change="displayImage(uploadPics.mypics3, 2)"
                :rules="mypicsRules"
                v-model="uploadPics.mypics3"
                accept="image/*"
                counter
                show-size
                prepend-icon="mdi-camera"
                placeholder="Picture 3"
                label="Picture 3"
                truncate-length="42"
              />
            </v-row>
            <v-row>
              <v-file-input
                @change="displayImage(uploadPics.mypics4, 3)"
                :rules="mypicsRules"
                v-model="uploadPics.mypics4"
                accept="image/*"
                counter
                show-size
                prepend-icon="mdi-camera"
                placeholder="Picture 4"
                label="Picture 4"
                truncate-length="42"
              />
            </v-row>
            <v-row>
              <v-file-input
                @change="displayImage(uploadPics.mypics5, 4)"
                :rules="mypicsRules"
                v-model="uploadPics.mypics5"
                accept="image/*"
                counter
                show-size
                prepend-icon="mdi-camera"
                placeholder="Picture 5"
                label="Picture 5"
                truncate-length="42"
              />
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
        <v-card
          :hover="true"
          v-ripple="{ class: `purple--text` }"
          class="mx-auto"
          max-width="434"
        >
          <v-img
            v-if="showPictures[1]"
            :src="`data:image/*;base64,${showPictures[1]}`"
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
                    v-if="showPictures[0]"
                    :src="`data:image/*;base64,${showPictures[0]}`"
                  />
                  <v-img
                    v-else
                    :src="`data:image/*;base64,${loadedPictures[0]}`"
                  />
                </v-avatar>
              </v-col>
            </v-row>
          </v-img>
          <v-img
            v-else
            :src="`data:image/*;base64,${loadedPictures[1]}`"
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
                    v-if="showPictures[0]"
                    :src="`data:image/*;base64,${showPictures[0]}`"
                  />
                  <v-img
                    v-else
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
            </div>
          </v-card-subtitle>
        </v-card>
        <v-row>
          <v-col cols="12" sm="6" offset-sm="3">
            <v-card>
              <v-container fluid>
                <v-row>
                  <v-col
                    class="d-flex child-flex"
                  >
                    <v-card flat tile class="d-flex">
                      <v-img
                        v-if="showPictures[2]"
                        :src="`data:image/*;base64,${showPictures[2]}`"
                        aspect-ratio="1"
                        class="green accent-3"
                        alt=""
                      />
                      <v-img
                        v-else
                        :src="`data:image/*;base64,${loadedPictures[2]}`"
                        aspect-ratio="1"
                        class="green accent-3"
                        alt=""
                      />
                    </v-card>
                  </v-col>
                  <v-col
                    class="d-flex child-flex"
                  >
                    <v-card flat tile class="d-flex">
                      <v-img
                        v-if="showPictures[3]"
                        :src="`data:image/*;base64,${showPictures[3]}`"
                        aspect-ratio="1"
                        class="yellow lighten-1"
                        alt=""
                      />
                      <v-img
                        v-else
                        :src="`data:image/*;base64,${loadedPictures[3]}`"
                        aspect-ratio="1"
                        class="yellow lighten-1"
                        alt=""
                      />
                    </v-card>
                  </v-col>
                  <v-col
                    class="d-flex child-flex"
                  >
                    <v-card flat tile class="d-flex">
                      <v-img
                        v-if="showPictures[4]"
                        :src="`data:image/*;base64,${showPictures[4]}`"
                        aspect-ratio="1"
                        class="deep-orange darken-1"
                        alt=""
                      />
                      <v-img
                        v-else
                        :src="`data:image/*;base64,${loadedPictures[4]}`"
                        aspect-ratio="1"
                        class="deep-orange darken-1"
                        alt=""
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </div>
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
      myGender: ['Bi', 'Man', 'Woman'],
      genderLF: ['Men & Women', 'Men', 'Women'],
      mypicsRules: [
        // value => value.size < 10000000 || 'Picture size should be less than 10 MB!'
      ],
      uploadPics: {
        mypics1: null,
        mypics2: null,
        mypics3: null,
        mypics4: null,
        mypics5: null
      },
      upload: 'false',
      imgone: '',
      showPictures: {
        '0': null,
        '1': null,
        '2': null,
        '3': null,
        '4': null
      }
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
    loadedPictures () {
      return this.$store.getters['user/loadedPictures']
    }
  },
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
    return {
      usermypics
    }
  },
  methods: {
    displayImage (File, number) {
      if (!File) {
        return
      }
      let renamed = ''
      const reader = new FileReader()
      reader.readAsDataURL(File)
      reader.onload = () => {
        renamed = reader.result.split(';base64,')
        this.showPictures[number] = renamed[1]
      }
    },
    validate () {
      if (this.$refs.mypicsform.validate()) {
        const data = new FormData()
        if (this.uploadPics.mypics1) {
          data.append('images', this.uploadPics.mypics1, 1)
        }
        if (this.uploadPics.mypics2) {
          data.append('images', this.uploadPics.mypics2, 2)
        }
        if (this.uploadPics.mypics3) {
          data.append('images', this.uploadPics.mypics3, 3)
        }
        if (this.uploadPics.mypics4) {
          data.append('images', this.uploadPics.mypics4, 4)
        }
        if (this.uploadPics.mypics5) {
          data.append('images', this.uploadPics.mypics5, 5)
        }
        const xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        const self = this
        // Returns an unsigned short, the state of the request.
        xhr.addEventListener('readystatechange', function () {
          // 4 means the request is DONE, operation completed
          if (this.readyState === 4) {
            if (this.status === 200 || this.status === '200') {
              self.$store.dispatch('interact/setMessage', 'Pictures updated !')
            }
          }
        })
        xhr.open('POST', process.env.serverUrl + '/users/upload')
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.$store.getters['user/token'])
        xhr.setRequestHeader('Accept', '*/*')
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        // xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate')
        // xhr.setRequestHeader('Connection', 'keep-alive')
        xhr.send(data)
      }
    }
  }
}
</script>
