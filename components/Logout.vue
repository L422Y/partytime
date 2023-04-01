<template>
  <div class="logout">
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts" setup>
const logout = () => {
  localStorage.removeItem("spotify_access_token")
  localStorage.removeItem("spotify_refresh_token")
  localStorage.removeItem("spotify_auth_token")
  window.location.href = "/"
}
</script>

<style lang="scss">
.logout {
  position: fixed;
  top: 0;
  z-index: 999;
  right: 0;
  left: 0;
  padding:1rem;
  display: grid;
  place-items: flex-end;

  button {
    background-color: #1db954;
    color: #ffffff;
    border: none;
    padding: 1rem 2rem;
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    button {
      opacity: 1;
    }
  }

}
</style>
