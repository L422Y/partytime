<script lang="ts" setup>
import { useAppStore } from "@/stores/app"
import { computed, onBeforeUnmount, ref } from "vue"

const playlistId = <string>useRoute().params?.playlistId || ""
const $router = useRouter()
const appStore = useAppStore()
const response = await useSpotifyGetPlaylist(playlistId)
const playlist = computed(() => response?.data?.value)
const playlistLink = computed(() => playlist?.value?.external_urls?.spotify)
const coverImage = computed(() => {
  if (playlist?.value?.images?.length > 0) {
    return playlist.value?.images[0]?.url
  }
})
const playlistView = ref()

const keyHandler = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    appStore.$state.showPlaylist = false
    $router.push("/")
  }
}
if (process.client) {

  onMounted(() => {
    window.addEventListener("keydown", keyHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", keyHandler)
  })
}

</script>
<template>
  <ClientOnly>
    <template v-if="appStore.spotifyAccessToken">
      <NuxtLink class="playlist-view__closer" to="/">&times;</NuxtLink>
      <aside ref="playlistView" class="playlist-view">
        <div class="playlist-view__wrapper">
          <div>
            <header class="playlist-view__header">
              <h1 v-if="playlist" class="playlist-view__h1">
                <a :href="playlistLink">{{ playlist.name }}</a>
              </h1>
              <p v-if="playlist?.description?.length > 0">{{ playlist?.description }}</p>
              <picture class="playlist-view__image">
                <img v-if="playlist" :src="coverImage" alt=""/>
              </picture>
            </header>
          </div>
          <div class="playlist-view__inside">
            <ol v-if="playlist?.tracks?.items" class="playlist-view__tracks">
              <TrackItem v-for="track in playlist.tracks?.items" :key="track.id" :track="track"/>
            </ol>
            <div v-else id="loading">Loading...</div>
          </div>
        </div>
      </aside>
    </template>
    <template v-else>
      <LoginView/>
    </template>
  </ClientOnly>
</template>
<style lang="scss">
$breakpoint-tablet: 800px;
.playlist-view {
  position: relative;
  box-sizing: border-box;
  width: 100vw;
  padding: 2rem 2rem 5rem;
  transition: opacity 0.3s;
  backdrop-filter: blur(10px);

  &__wrapper {
    display: grid;
    align-content: flex-start;
    align-items: flex-start;
    justify-content: flex-start;
    max-width: 1280px;
    margin: 2rem auto;
    gap: 2rem;
    @media (min-width: $breakpoint-tablet) {
      gap: 3rem;
      grid-template-columns: 1fr 2fr;
    }

    > * {
      height: 100%;
    }
  }

  &__closer {
    font-size: 5rem;
    line-height: 0;
    position: fixed;
    z-index: 4;
    top: 1rem;
    right: 0;
    padding: 1rem;
    cursor: pointer;
    text-decoration: none;
    color: #ffffff;
    mix-blend-mode: difference;
  }

  &__image {
    display: block;
    overflow: hidden;
    align-self: flex-start;

    img {
      display: block;
      width: 100%;
    }
  }

  &__inside {
    position: relative;
    min-height: 64vh;
    padding: 0rem 1rem 1rem 2rem;
    transform: rotate3d(0, 0, 0, 0deg);
    @media screen and (min-width: var(--breakpoint-tablet)) {
      padding: 4rem;
    }
  }

  &__header {
    position: sticky;
    top: 4rem;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 2rem;
  }

  &__h1 {
    font-size: 4rem;
    margin: 0;

    a {
      text-decoration: none;
    }
  }

  &__tracks {
    display: grid;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style: decimal;
    gap: 2rem;
  }

  > h1 {
    font-size: 4rem;
    padding: 0 2rem;
    text-transform: uppercase;
  }

  a {
    color: #fff;
  }

  span.trackTitle {
    font-size: 1.4rem;
  }

  span.artist {
    + span.artist {
      &:before {
        content: ', ';
      }
    }
  }
}


.showPlaylist aside {
  pointer-events: all;
  opacity: 1;
}
</style>
