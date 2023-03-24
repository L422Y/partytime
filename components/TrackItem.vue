<script lang="ts" setup>
import { ISpotifyPlaylistTrack } from "@/types/spotify"
import { computed } from "vue"

const props = defineProps<{ track: ISpotifyPlaylistTrack }>()
const track = computed(() => props.track?.track)
const trackName = computed(() => track.value?.name)
const trackLink = computed(() => track.value?.external_urls.spotify)
const artistNames = computed(() =>
  track.value?.artists
    .map((artist) => `<a target="_blank" href="${artist.external_urls.spotify}">${artist.name}</a>`)
    .join(", ")
)
</script>

<template>
  <li class="track">
    <a :href="trackLink" class="track__name" target="_blank">{{ trackName }}</a>
    <div class="track__artists" v-html="artistNames"/>
    <!--    <a :href="track.external_urls.spotify" class="playlist-view__track-title" target="_blank">{{ track.name }}</a>-->
    <!--        <span v-for="artist in track.track.artists" :key="artist.id" class="artist">-->
    <!--          <a :href="artist.external_urls.spotify" rel="author">{{ artist.name }}</a>-->
    <!--        </span>-->
  </li>
</template>
<style lang="scss">
.track {
  padding: 0.5rem 0.5rem 1rem;
  border-bottom: 1px solid #eee;

  &::marker {
    font-size: 1.7rem;
  }

  a {
    text-decoration: none;
  }

  &__name {
    font-size: 1.7rem;
    font-weight: 700;
    flex: 1;
  }

  &__artists {
    font-size: 1rem;
    font-weight: 300;
    flex: 1;
    text-align: left;
  }
}
</style>
