<template>
  <div class="login">
    <button class="btn login__with-spotify" @click="startSpotifyAuth">Log in with Spotify</button>
  </div>
</template>

<script lang="ts" setup>
const startSpotifyAuth = () => {
  const authUrl = useSpotifyAuthURL()
  window.location.href = authUrl
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  &__with-spotify {
    font-size: 1.2rem;
    font-weight: 600;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    color: #fff;
    border: none;
    border-radius: 50px;
    background-color: #1db954;

    &:hover {
      background-color: #1ed760;
    }
  }
}
</style>
