<template>
  <div class="queued-track">
    <div class="queued-track__index"><span>{{ index + 1 }}</span></div>
    <div class="queued-track__info">
      <div class="queued-track__title" v-html="track.name"/>
      <div class="queued-track__artist" v-html="artists"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ISpotifyTrack } from "~/types/spotify"

const {index, track} = defineProps<{ index: number, track: ISpotifyTrack }>()
const artists = computed(() => {
  if (track.artists) {
    return track.artists
      .map((artist) => artist.name)
      .join(", ")
  }
})
</script>

<style lang="scss">
.queued-track {
  display: grid;
  align-items: flex-start;
  padding: 1em;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #0009;
  grid-template-columns: 4em 1fr;

  &:hover {
    background-color: #000f;
  }

  &__index {
    font-size: 2em;
    font-weight: 600;
    width: 3em;
    vertical-align: top;
    color: #aaa;
  }

  &__info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin-right: 0;
  }

  &__title {
    font-size: 1.2em;
    font-weight: 600;
    margin-bottom: 0;
  }

  &__artist {
    font-size: .9em;
    color: #aaa;
  }
}
</style>
