<template>
  <modal ref="modal">
    <form class="app-form">
      <div class="form-control">
        <label class="label">Email</label>
        <input
          v-model="form.email"
          class="form-input"
          type="text"
          purple
        >
      </div>
      <div class="form-control">
        <label class="label">Username</label>
        <input
          v-model="form.username"
          class="form-input"
          type="text"
        >
      </div>
      <div class="form-control">
        <label class="label">First name</label>
        <input
          v-model="form.firstname"
          class="form-input"
          type="text"
        >
      </div>
      <div class="form-control">
        <label class="label">Last name</label>
        <input
          v-model="form.lastname"
          class="form-input"
          type="text"
        >
      </div>
      <div class="form-control">
        <label class="label">Password</label>
        <input
          v-model="form.password"
          class="form-input"
          type="text"
        >
      </div>
      <v-col class="text-center" cols="12" sm="4">
        <div class="my-2">
          <v-btn
            @click="submitForm"
            type="button"
            primary
          >
            Valid Registration
          </v-btn>
        </div>
      </v-col>
    </form>
  </modal>
</template>

<script>
import Modal from '@/components/entest/Modal'
export default {
  components: {
    Modal
  },
  data () {
    return {
      form: {
        email: '',
        username: '',
        firstname: '',
        lastname: '',
        password: ''
      },
      forceClose: false
    }
  },
  computed: {
    isFormValid () {
      if (this.form.email && this.form.username && this.form.firstname && this.form.lastname && this.form.password) {
        return true
      } else {
        return false
      }
    },
    modal () {
      return this.$refs.modal
    }
  },
  methods: {
    submitForm () {
      if (this.isFormValid) {
        this.$emit('formSubmitted', { ...this.form })
        this.modal.close()
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
