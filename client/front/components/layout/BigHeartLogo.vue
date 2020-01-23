<template>
  <div class="BigHeartLogo">
    <v-img src="/doubleheart.png" aspect-ratio="1.7" contain />
  </div>
</template>

<style scoped>
.BigHeartLogo {
  animation: turn 4s linear forwards 0s;
  transform: rotateX(24deg);
}

@keyframes turn {
  100% {
    transform: rotateX(0deg);
  }
}
</style>
