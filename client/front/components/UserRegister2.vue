<template>
  <div id="app">
    <v-app id="inspire">
      <form>
        <v-text-field
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          v-model="email"
          :error-messages="emailErrors"
          label="Email"
          required
        />
        <v-text-field
          @input="$v.username.$touch()"
          @blur="$v.username.$touch()"
          v-model="username"
          :error-messages="usernameErrors"
          :counter="18"
          label="Username"
          required
        />
        <v-text-field
          @input="$v.firstname.$touch()"
          @blur="$v.firstname.$touch()"
          v-model="firstname"
          :error-messages="firstnameErrors"
          :counter="28"
          label="First name"
          required
        />
        <v-text-field
          @input="$v.lastname.$touch()"
          @blur="$v.lastname.$touch()"
          v-model="lastname"
          :error-messages="lastnameErrors"
          :counter="28"
          label="Last name"
          required
        />
        <v-select
          @change="$v.sex.$touch()"
          @blur="$v.sex.$touch()"
          v-model="sex"
          :sex="sex"
          :error-messages="sexErrors"
          label="Sex"
          required
        />
        <v-checkbox
          @change="$v.checkbox.$touch()"
          @blur="$v.checkbox.$touch()"
          v-model="checkbox"
          :error-messages="checkboxErrors"
          label="All information is correct ?"
          required
        />
        <v-btn
          @click="submit"
          class="mr-4"
        >
          submit
        </v-btn>
        <v-btn
          @click="clear"
        >
          clear
        </v-btn>
      </form>
    </v-app>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        email: '',
        username: '',
        firstname: '',
        lastname: '',
        password: ''
      }
    }
  },
  computed: {
    isFormValid () {
      if (this.form.email && this.form.username && this.form.firstname && this.form.lastname && this.form.password) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    submitForm () {
      if (this.isFormValid) {
        this.$emit('formSubmitted', { ...this.form })
        // this.forceClose = true
        // this.$nextTick(() => this.forceClose = false)
        this.resetForm()
      }
    },
    resetForm () {
      this.form.email = ''
      this.form.username = ''
      this.form.firstname = ''
      this.form.lastname = ''
      this.form.password = ''
    }
  }
}
</script>
