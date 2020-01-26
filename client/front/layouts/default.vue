<template>
  <div class="ccontainer">
    <TheNavbar />
    <!-- <AuthList /> -->
    <nuxt />
    <TheFooter />
  </div>
</template>

<script>

import TheNavbar from '@/components/layout/TheNavbar'
// import AuthList from '@/components/users/AuthList'
import TheFooter from '@/components/layout/TheFooter'
// import TheBackground from '@/components/TheBackground'

export default {
  components: {
    TheNavbar,
    // AuthList,
    TheFooter
    // TheBackground
  }
}
</script>

<style>

.ccontainer {

  /* background-color: hsla(0, 100%, 90%, 0.1);
  background-color: #fff5f5;*/
  background-image: url("/04_homepage_beachkiss_opacity42.png");
  background-color: rgb(248, 225, 255);
  z-index: -8;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  /* position: relative;
  box-sizing: border-box; */
  height: 100%;
}
</style>
