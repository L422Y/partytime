<template>
  <div class="queue">
    <header class="queue__head">
      <span class="queue__upnext"><span>
        UP NEXT
      </span>
        <Meter
          ref="meter"
          :meterTransitionTime="meterTransitionTime"
          :value="meterConfig.value * 100"
          class="queue__meter"
          meterStyle="round"
        /></span>
      <VotingInfo v-if="voting" class="queue__voting"/>
    </header>
    <div class="queue__items">
      <QueuedTrack v-for="queuedTrack in placeholders" :queued-track="queuedTrack"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { usePlayerStore } from "~/stores/player"
import { computed } from "#imports"
import QueuedTrack from "~/components/Queue/QueuedTrack.vue"
import { useVotesStore } from "~/stores/votes"
import VotingInfo from "~/components/Voting/VotingInfo.vue"
import Meter from "~/components/Meter.vue"


const currentQueueTracks = useState("currentQueueTracks", () => [])
const currentQueueElements = useState("currentQueueElements", () => [])


let currentId = 0

const placeholders = new Array(12).fill(0).map((_, index) => {
  return {
    id: currentId++,
    originalIndex: index,
    track: {
      artists: [],
      name: "",
      uri: "",
    },
  }
})

const tracks = computed(() => usePlayerStore().$state.currentQueue?.queue?.slice(0, 12) || [])
const votesStore = useVotesStore()

const runtimeConfig = useRuntimeConfig()
const voting = computed(() => runtimeConfig.public.voting)

const meterConfig = ref({color: "#ffffff", value: 0})
const indexedTracks = ref()
const secondIndexed = ref()

const updateIndexedTracks = () => {
  indexedTracks.value = tracks.value?.map((track, index) => {
    return {
      originalIndex: index,
      track,
    }
  })
}

watch(tracks, updateIndexedTracks)
setTimeout(updateIndexedTracks, 0)
let lastTracks: string = ""
watch(indexedTracks, (tracks) => {
  const json = JSON.stringify(tracks.map(({track}) => track.id))
  if (lastTracks != "" && lastTracks === json) {
    return
  }
  lastTracks = json
  secondIndexed.value = tracks.map(({originalIndex, track}, index) => {
    return {
      index,
      originalIndex,
      id: currentId++,
      track: {
        artists: track.artists,
        name: track.name,
        uri: track.uri,
        id: track.id
      },
    }
  })
})

const votesSnapshot = ref(votesStore.$state.votesById)
const meter: Ref<typeof Meter | undefined> = ref()
const meterTransitionTime = ref(0)
const resetMeter = () => {
  meterTransitionTime.value = 0
  setTimeout(() => {
    meterConfig.value = {color: "#ffffff", value: 0}
    setTimeout(() => {
      meterTransitionTime.value = 10
      setTimeout(() => {
        meterConfig.value = {color: "#ffffff", value: 1}
      }, 100)
    }, 10)
  }, 0)
}


const updateCurrentQueueTracks = () => {
  currentQueueTracks.value = ( secondIndexed.value?.sort((a, b) => {
    const aVotes = votesSnapshot.value[a.track.id]?.length || 0
    const bVotes = votesSnapshot.value[b.track.id]?.length || 0
    return bVotes - aVotes
  }) || [] ).map(({track, originalIndex, id}: any, index: number) => {
    return {track, originalIndex, id, index}
  })
}


let snapInterval: any
let resetInterval: any
updateCurrentQueueTracks()
const refresh = () => {
  votesSnapshot.value = votesStore.$state.votesById
  updateCurrentQueueTracks()

}

snapInterval = setInterval(() => {
  refresh()
}, 10000)
resetInterval = setInterval(() => {
  resetMeter()
}, 10000)
refresh()
resetMeter()
setTimeout(() => {
  refresh()
  resetMeter()
}, 500)

onBeforeUnmount(() => {
  clearInterval(snapInterval)
  clearInterval(resetInterval)
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
    display: flex;
    justify-content: space-between;
    margin: 0 1rem 1rem 1rem;
    text-transform: uppercase;
    @media (max-width: 768px) {
      font-size: 1.4rem;
      flex-direction: column-reverse;
      text-align: center;
      gap: 2rem;
      .queue__upnext {
        font-size: 2.5rem;
      }
    }
  }

  .queue__upnext {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__items {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);
    @media (max-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (orientation: portrait) and (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    gap: 0.2rem;
  }

  &__meter {
    width: 2rem;
    height: 2rem;

    circle {
      fill: none;
      stroke-linecap: round;

      &#track {
        stroke: #ffffff22 !important;
      }
    }

    @media (max-width: 768px) {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}

</style>
