<template>
  <div ref="outside" class="queued-track">
    <div ref="inside" class="queued-track__inside">
      <div class="queued-track__index"><span>{{ trackIndex }}</span></div>
      <div class="queued-track__info">
        <div class="queued-track__meta">
          <div class="queued-track__title" v-html="track?.name"/>
          <div class="queued-track__artist" v-html="artists"/>
        </div>
        <div v-if="voting" class="queued-track__votes">
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
import { useVotesStore } from "~/stores/votes"
import { ISpotifyArtist, ISpotifyTrack } from "~/types/spotify"
import { computed } from "#imports"

const currentQueueTracks: Ref<{
  index: number,
  originalIndex: number,
  id: number,
  track: ISpotifyTrack
}[]> = useState("currentQueueTracks", () => [])

const currentQueueElements = useState("currentQueueElements", () => [])
const props = defineProps<{
  queuedTrack: {
    id: number,
    originalIndex: number,
  }
}>()

const track: Ref<ISpotifyTrack | undefined> = ref()
const outside = ref()

currentQueueElements[props.queuedTrack.id] = outside


const inside = ref()
const runtimeConfig = useRuntimeConfig()
const voting = runtimeConfig.public.voting
const voteStore = useVotesStore()
const trackIndex = ref(0)
const artists = ref("")

const votes = computed(() => voteStore.$state.votesById[track.value?.id]?.length || 0)


const refreshTrack = () => {
  trackIndex.value = currentQueueTracks.value[props.queuedTrack.originalIndex]?.originalIndex + 1 || -1
  track.value = currentQueueTracks.value[props.queuedTrack.originalIndex]?.track
  artists.value = track.value?.artists?.map((artist: ISpotifyArtist) => artist.name).join(", ")
}

const unwatchFirst = watch(currentQueueTracks, () => {
  refreshTrack()
  unwatchFirst()
})

let updateTimer: any
onMounted(() => {
  updateTimer = setInterval(refreshTrack, 1000)
})

onBeforeUnmount(() => {
  clearInterval(updateTimer)
})


</script>

<style lang="scss">
.queued-track {
  display: block;
  width: 100%;
  box-sizing: border-box;
  //display: grid;
  //align-items: flex-start;
  //padding: 1em;
  //cursor: pointer;
  //transition: all 0.2s ease-in-out;
  //background-color: #0001;
  //grid-template-columns: 4em 1fr;
  //height: 4rem;
  &__inside {
    box-sizing: border-box;
    overflow: hidden;
    display: grid;
    width: 100%;
    align-items: flex-start;
    padding: 1em;
    cursor: pointer;
    transition: all 2s ease-in-out;
    background-color: #0009;
    grid-template-columns: 4em minmax(0, 1fr);
    //position: absolute;
    //width: calc((100vw - 10em) / 4);
    //top:0;
    //left:0;
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
    max-width: 100%;
  }

  &__title {
    box-sizing: border-box;
    width: calc(100% - 1.4em);
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    overflow: hidden;
    font-size: 1.2em;
    font-weight: 600;
    margin-bottom: 0;
  }

  &__artist {
    max-width: calc(100% - 1.4em);

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
