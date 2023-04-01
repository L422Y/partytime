<template>
  <div class="queued-track">
    <div class="queued-track__index"><span>{{ trackIndex }}</span></div>
    <div class="queued-track__info">
      <div class="queued-track__meta">
        <div class="queued-track__title" v-html="track.name"/>
        <div class="queued-track__artist" v-html="artists"/>
      </div>
      <div class="queued-track__votes" v-if="voting">
        <template v-if="votes">
          {{ votes }} vote(s)
        </template>
        <template v-else>
          No votes
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "#imports"

const {index, originalIndex, track} = defineProps<{
  index: number,
  originalIndex: number,
  track: ISpotifyTrack
}>()

import { ISpotifyTrack } from "~/types/spotify"
import { useVotesStore } from "~/stores/votes"

const runtimeConfig = useRuntimeConfig()
const voting = computed(() => runtimeConfig.public.voting)

const trackIndex = originalIndex + 1
const voteStore = useVotesStore()
const votes = computed(() => {
  return voteStore.$state.votesById[trackIndex]?.length
})
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
    justify-content: space-between;
    height: 100%;
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

  &__votes {
    font-size: .9em;
    align-self: flex-end;
    color: #aaa;
    justify-self: flex-end;
  }
}
</style>
