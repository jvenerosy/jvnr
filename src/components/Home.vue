<template>
  <div class="home">
    <h1 class="title">jvnr</h1>
    <h2 class=subtitle>en construction</h2>
  </div>
</template>

<script>

export default {
  name: 'Home',
};

</script>

<style lang="scss" scoped>
.home {
  font-family: 'Teko', sans-serif;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.title {
  font-size: 15rem;
  text-transform: uppercase;
  line-height: .6em;
}

.subtitle {
  font-size: 3rem;
}
</style>
