<script setup lang="ts">
import { useSpotifyAPI } from '@/composables/useSpotify'
import { useAppStore } from '@/stores/app'
import { computed, ref } from 'vue'
import PlaylistTile from './PlaylistTile.vue'

const appStore = useAppStore()
const playlists = computed(() => appStore.playlists.items)
</script>

<template>
  <div v-if="appStore">
    <ul>
      <PlaylistTile v-for="playlist in playlists" :key="playlist.id" :playlist="playlist" />
    </ul>
  </div>
  <div v-else id="loading">Loading playlists...</div>
</template>
