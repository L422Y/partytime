<template>
  <div class="queue">
    <header class="queue__head">
      <span class="queue__upnext">UP NEXT</span>
      <VotingInfo class="queue__voting" v-if="voting" />
    </header>
    <div class="queue__items">
      <QueuedTrack v-for="{index, originalIndex, track} in sortedTracks" :index="index" :originalIndex="originalIndex"
                   :track="track"/>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { usePlayerStore } from "~/stores/player"
import { computed } from "#imports"
import QueuedTrack from "~/components/Queue/QueuedTrack.vue"
import { useVotesStore } from "~/stores/votes"
const tracks = computed(() => usePlayerStore().$state.currentQueue?.queue?.slice(0, 8) || [])
const playerStore = usePlayerStore()
const votesStore = useVotesStore()

const runtimeConfig = useRuntimeConfig()
const voting = computed(() => runtimeConfig.public.voting)

const sortedTracks = computed(() => {
  const indexedTracks = tracks.value.map((track, originalIndex) => ( {originalIndex, track} ))
  let sortedTracks = indexedTracks.sort((a, b) => {
    const aVotes = votesStore.$state.votesById[a.originalIndex + 1]?.length || 0
    const bVotes = votesStore.$state.votesById[b.originalIndex + 1]?.length || 0
    return bVotes - aVotes
  })

  sortedTracks = sortedTracks.map((track, index) => {
    return {
      index,
      ...track
    }
  })
  console.log("=====================")

  for (let i = 0; i < sortedTracks.length; i++) {
    console.log(
      sortedTracks[i].originalIndex,
      votesStore.$state.votesById[sortedTracks[i].originalIndex]?.length || 0,
      sortedTracks[i].index,
      sortedTracks[i].track.name)
  }
  return sortedTracks
})
</script>
<style lang="scss">
.queue {
  font-size: 0.8rem;
  position: relative;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  align-self: flex-end;
  width: auto;
  height: fit-content;
  padding: 0.5rem;
  text-align: left;
  gap: 0.4em;

  &__head {
    font-size: 3em;
    font-weight: 200;
    line-height: 1;
    margin: 0 1.5em 1rem 1.5em;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    @media (max-width: 768px) {
      text-align: center;
      flex-direction: column-reverse;
      gap:2rem;
      font-size: 1.4rem;
      .queue__upnext {
        font-size: 2.5rem;
      }
    }
  }

  &__items {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    @media (max-width: 1024px) {
      grid-template-columns: 1fr 1fr;

    }
    @media (orientation: portrait) and (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    gap: 0.2rem;
  }
}
</style>
