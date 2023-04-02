<template>
  <div class="queued-track" ref="outside">
    <div class="queued-track__inside" ref="inside">
      <div class="queued-track__index"><span>{{ trackIndex }}</span></div>
      <div class="queued-track__info">
        <div class="queued-track__meta">
          <div class="queued-track__title" v-html="props.queuedTrack.track.name"/>
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
  </div>
</template>

<script lang="ts" setup>
import { computed } from "#imports"
import { ISpotifyTrack } from "~/types/spotify"
import { useVotesStore } from "~/stores/votes"

const props = defineProps<{
  queuedTrack: {
    index: number,
    id: number,
    originalIndex: number,
    track: ISpotifyTrack
  }
}>()

const outside = ref()
const inside = ref()
const runtimeConfig = useRuntimeConfig()
const voting = computed(() => runtimeConfig.public.voting)
const trackIndex = computed(() => props.queuedTrack.originalIndex + 1)
const voteStore = useVotesStore()
const votes = computed(() => {
  return voteStore.$state.votesById[props.queuedTrack.originalIndex]?.length
})

watch(props, () => {
  if (props.queuedTrack.index) {
    const containerBounds = outside.value.getBoundingClientRect()
    inside.value.style.top = `${containerBounds.top}px`
    inside.value.style.left = `${containerBounds.left}px`
    inside.value.scrollIntoView({ behavior: "smooth" })
  }
})
const artists = computed(() => {
  if (props.queuedTrack.track.artists) {
    return props.queuedTrack.track.artists
      .map((artist) => artist.name)
      .join(", ")
  }
})

</script>

<style lang="scss">
.queued-track {
  //display: grid;
  //align-items: flex-start;
  //padding: 1em;
  //cursor: pointer;
  //transition: all 0.2s ease-in-out;
  //background-color: #0001;
  //grid-template-columns: 4em 1fr;
  //height: 3rem;

  &__inside {
    display: grid;
    align-items: flex-start;
    padding: 1em;
    cursor: pointer;
    transition: all 2s ease-in-out;
    background-color: #0009;
    grid-template-columns: 4em 1fr;
    //position: fixed;
    //width: calc((100vw - 10em) / 4);
  }

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
