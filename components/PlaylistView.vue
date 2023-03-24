<script lang="ts" setup>
import TrackItem from '@/components/TrackItem.vue'
import { useSpotifyAPI } from '@/composables/useSpotify'
import { useAppStore } from '@/stores/app'
import { computed, getCurrentInstance, ref, watch } from 'vue'

const appStore = useAppStore()

const app = getCurrentInstance()
const playlist = computed(() => appStore.currentPlaylist)
const playlistLink = computed(() => appStore.currentPlaylist.external_urls.spotify)
const coverImage = computed(() => {
  if (playlist.value.images?.length > 0) {
    return playlist.value?.images[0]?.url
  }
})
const tracks = ref([])

const playlistView = ref()

watch(playlist, async (newPlaylist) => {
  if (newPlaylist?.id) {
    playlistView.value.scrollTop = 0
    await useSpotifyAPI(`/playlists/${newPlaylist.id}/tracks`, {}).then((oData) => {
      if (oData.data?.items?.length > 0) {
        tracks.value = oData.data.items
      }
    })
  }
})

const closeView = () => {
  appStore.$state.showPlaylist = false
}
</script>

<template>
  <aside ref="playlistView" class="playlist-view">
    <picture class="playlist-view__image">
      <img v-if="playlist" :src="coverImage" alt="" />
    </picture>
    <div class="playlist-view__wrapper">
      <span class="playlist-view__closer" @click="closeView">&times;</span>

      <div class="playlist-view__inside">
        <header class="playlist-view__header">
          <h1 v-if="playlist" class="playlist-view__h1">
            <a :href="playlistLink">{{ playlist.name }}</a>
          </h1>
          <p v-if="playlist.description?.length > 0">{{ playlist.description }}</p>
        </header>
        <ol v-if="tracks" class="playlist-view__tracks">
          <TrackItem v-for="track in tracks" :key="track.id" :track="track" />
        </ol>
        <div v-else id="loading">Loading...</div>
      </div>
    </div>
  </aside>
</template>
<style lang="scss">
.playlist-view {
  position: relative;
  box-sizing: border-box;
  padding: 2rem;
  background: #00000099 !important;
  backdrop-filter: blur(10px);

  &__wrapper {
    max-width: 1024px;
    margin: 0 auto;
    background: #ffffff;
  }

  &__closer {
    font-size: 5rem;
    line-height: 0;
    position: absolute;
    z-index: 4;
    top: 1rem;
    right: 0;
    padding: 1rem;
    cursor: pointer;
    color: #ffffff;
    mix-blend-mode: difference;
  }

  &__image {
    position: sticky;
    z-index: 0;
    top: 0;
    right: 0;
    left: 0;
    display: block;
    overflow: hidden;
    max-width: calc(100% - 4rem);
    max-height: calc(100% - 4rem);
    padding: 2rem 2rem 0 2rem;

    img {
      display: block;
      width: 100%;
    }
  }

  &__inside {
    position: relative;
    min-height: 64vh;
    margin-top: calc(-80vh);
    padding: 4rem;
    background-color: #fff;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }

  &__h1 {
    font-size: 4rem;
    margin: 0;
  }

  &__tracks {
    display: grid;
    margin: 0;
    margin-top: 2rem;
    padding: 0;
    list-style: decimal;
    gap: 2rem;
    @media (min-width: 768px) {
      display: block;
      column-count: 2;
      column-gap: 2rem;
      li {
        display: block;
        padding-top: 2rem !important;
      }
    }
  }
}
</style>
