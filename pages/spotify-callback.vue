<script lang="ts" setup>
import { useSpotifyAuthGetAccessToken } from '#imports'
import { useAppStore } from '~/stores/app'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(async () => {
  const hash = new URLSearchParams(window.location.search)
  const spotifyAuthCode = hash.get('code')
  if (spotifyAuthCode && spotifyAuthCode.length > 0) {
    useAppStore().$state.spotifyAuthCode = spotifyAuthCode
    await useSpotifyAuthGetAccessToken(spotifyAuthCode)
    router.push('/')
  } else {
    console.log('no code')
    router.push('/')
  }
})
</script>

<template>
  <div>Loading...</div>
</template>
