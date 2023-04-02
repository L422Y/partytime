<script lang="ts" setup>
import { getCurrentInstance } from "vue"
import { ISpotifyPlaylist } from "@/types/spotify"
import { usePlayerStore } from "~/stores/player"
import { useRoute } from "#app"
import CurrentQueue from "~/components/Queue/CurrentQueue.vue"
import { useVotesStore } from "../stores/votes"

const {mode: initialMode} = withDefaults(defineProps<{ playlist?: ISpotifyPlaylist, mode: string }>(),
  {
    mode: "normal"
  }
)
const mode = ref(initialMode)
const app = getCurrentInstance()
const player = usePlayerStore()
const voteStore = useVotesStore()
const transitionTime = ref(0)
let trackTimeout: any

const playerState = computed(() => player.$state)
let lastPercentDone = 0
const percentDone = computed(() => {
  let pdone = 0
  if (playerState.value?.progress_ms && playerState.value.item?.duration_ms) {
    pdone = playerState?.value?.progress_ms / playerState.value.item?.duration_ms * 100
    if (!trackTimeout) {
      trackTimeout = setTimeout(() => {
        player.refreshPlayer()
        trackTimeout = null
      }, playerState.value.item?.duration_ms - playerState.value.progress_ms)
    }
  }
  if (pdone < lastPercentDone) {
    transitionTime.value = 0
  } else {
    transitionTime.value = 10
  }
  lastPercentDone = pdone

  return pdone
})

const minimized = computed(() => player.$state?.nowPlayingMinimized)
const votes = computed(() => voteStore.$state?.votes)
const deviceType = computed(() => player.$state?.device?.type == "Computer" ? "desktop" : "mobile-phone")
const artists = computed(() => {
  if (playerState.value.item?.artists) {
    return playerState.value.item?.artists.map((artist) => artist.name).join(", ")
  }
})

const nowPlaying: Ref<HTMLElement | undefined> = ref()
const dataUrl = ref()
const cloneImage = ref()
let currentTrack = ""


const track = computed(() => {
  if (currentTrack === "" || playerState.value.item?.name && playerState.value.item?.name !== currentTrack) {
    setTimeout(checkTrackNameWidth, 0)
  }
  if (playerState.value.item?.name) {
    currentTrack = playerState.value.item?.name
    return playerState.value.item?.name
  }
})
const trackName = ref()


const checkTrackNameWidth = () => {
  const trackNameEl = trackName.value as HTMLElement
  if (trackNameEl) {
    const trackNameWidth = trackNameEl?.offsetWidth
    const trackNameHeight = trackNameEl?.offsetHeight
    const trackNameParentWidth = trackNameEl?.parentElement?.offsetWidth
    const windowHeight = window.innerHeight

    if (trackNameEl.style.zoom === "1" || !trackNameEl.style.zoom) {
      if (( trackNameParentWidth && trackNameWidth > trackNameParentWidth ) || ( trackNameHeight && trackNameHeight > ( windowHeight * .42 ) )) {
        // @ts-ignore
        trackNameEl.style.zoom = `${Math.min(trackNameParentWidth / trackNameWidth, windowHeight * .42 / trackNameHeight)}`
      }
        // else if (trackNameHeight > ( windowHeight * .42 )) {
        //   // @ts-ignore
        //   trackNameEl.style.zoom = `${windowHeight * .42 / trackNameHeight}`
      // }
      else {
        // @ts-ignore
        trackNameEl.style.zoom = "1"
      }
    }
  }
}
//
// if (mode.value === "big") {
//
//   watch(() => track, async () => {
//
//     console.log("playerState changed")
//     // if (node) {
//     //   const clonedNode = node.cloneNode(true)
//     //   document.body.appendChild(clonedNode)
//     //   clonedNode.
//     //   clonedNode.border = "1px solid black"
//     // }
//     if (nowPlaying.value) await domtoimage.toJpeg(
//       nowPlaying.value, {quality: 0.95}).then(function (uri) {
//       dataUrl.value = uri
//       cloneImage.value.style.transition = "opacity 0s ease-in-out"
//       setTimeout(() => {
//         cloneImage.value.style.opacity = "1"
//         cloneImage.value.style.transition = "opacity 2s ease-in-out"
//         setTimeout(() => {
//           cloneImage.value.style.opacity = "0"
//         })
//       })
//     })
//   })
// }
const toggleBigMode = () => {
  if (useRoute().path !== "/now-playing") {
    useRouter().push("/now-playing")
  } else {
    useRouter().push("/")
  }
}

</script>
<template>
  <div
    v-if="playerState.device"
    ref="nowPlaying"
    :class="[minimized && !(mode === 'big') ? 'minimized' : '', mode ]"
    class="now-playing"
    @click="toggleBigMode">
<!--    <img v-if="mode === 'big' && dataUrl" ref="cloneImage" :src="dataUrl" alt="" class="cloneImage">-->

    <aside class="now-playing__inside">
      <header class="now-playing__head">Now Playing</header>
      <div class="now-playing__what">
        <span v-if="mode === 'normal'">
          {{ playerState.item?.name }} - {{ artists }}
        </span>
        <div v-else-if="mode === 'big'">
          <div class="now-playing__track">
            <span ref="trackName" v-html="track"/>
          </div>
          <div class="now-playing__artists">
            {{ artists }}
          </div>
        </div>
        <span v-if="mode === 'normal'" class="now-playing__album">
          {{ playerState.item?.album?.name }} - {{ playerState.item?.album?.release_date }}
        </span>
        <div v-if="mode === 'big'" class="now-playing__album">
          <div>{{ playerState.item?.album?.name }}</div>
          <div>{{ playerState.item?.album?.release_date }}</div>
        </div>
        <div class="now-playing__progress">
          <div :style="{width: `${percentDone}%`, transition:`width ${transitionTime}s linear`}"
               class="now-playing__progress-bar"/>
        </div>
      </div>
      <div class="now-playing__device">
        <span><font-awesome-icon :icon="deviceType"></font-awesome-icon> {{ playerState.device?.name }}</span>
        <span>-</span>
        <span>Volume: {{ playerState.device?.volume_percent }}%</span>
      </div>
      <template v-if="mode==='big'">
        <picture class="now-playing__cover">
          <img :src="playerState.item?.album?.images[0].url" alt="">
        </picture>
      </template>
      <template v-if="mode==='big'">
        <CurrentQueue/>
      </template>
    </aside>
  </div>
</template>
<style lang="scss">
.now-playing {
  font-size: clamp(1rem, 5vw, 2rem);
  position: fixed;
  z-index: 100;
  top: calc(100vh - 8em);
  right: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  width: auto;
  height: 8em;
  max-height: 8em;

  &.minimized {
    top: 100vh;
    overflow: hidden;
  }

  &__head {
    font-size: .6em;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 0em;
    text-transform: uppercase;
  }

  &__what {
    font-size: 1em;
    font-weight: 600;
    line-height: 1;
    display: flex;
    flex-direction: column;
    text-transform: uppercase;
    gap: 0.4em;
  }

  &__album {
    font-size: .8em;
    font-weight: 600;
    line-height: 1;
    display: flex;
    text-transform: uppercase;
    color: #999999;
    gap: 0.4em;
  }

  &__device {
    font-size: .8em;
    font-weight: 600;
    line-height: 1;
    display: flex;
    text-transform: uppercase;
    color: #505050;
    gap: 0.4em;
  }

  &__inside {
    position: relative;
    z-index: 2;
    left: 50%;
    display: grid;
    max-width: 50%;
    padding: 1em;
    transform: translateX(-50%);
    background-color: #000a;
    gap: 1em;
  }

  &.big {
    font-size: clamp(1rem, 5vw, 5rem);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    height: 100vh;
    max-height: 100vh;

    .now-playing__head {
      font-size: .5em;
      text-align: center;
      color: #fff5;
    }

    .now-playing__inside {
      position: relative;
      left: 0;
      display: grid;
      box-sizing: border-box;
      width: 100%;
      max-width: 100vw;
      height: 100%;
      padding: 0em;
      transform: none;
      text-align: center;
      background-color: #000a;
      gap: 3rem;
    }

    .now-playing__head {
      margin-top: 2rem;
    }

    .now-playing__what {
      font-size: 1.3em;
      line-height: .8;
      justify-content: center;
      width: 100%;
      max-width: calc(100vw - 5rem);
      margin: 0 auto;
      filter: drop-shadow(0 0 100px #000);
    }

    .now-playing__track {
      font-size: 2.0em;
      line-height: 0.8;

      span {
        transition: zoom 1s;
      }
    }

    .now-playing__artists {
      font-size: .5em;
      font-weight: 300;
      margin-top: 2rem;
      letter-spacing: .3rem;
    }

    .now-playing__album {
      font-size: .4em;
      font-weight: 100;
      flex-direction: column;
      justify-content: center;
    }

    .now-playing__device {
      display: none;
    }

    .now-playing__progress {
      position: relative;
      z-index: 2;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 0.2rem;
      padding: 0em;
      border-radius: 0.25rem;
      background-color: #000a;
      gap: 1em;
    }

    .now-playing__progress-bar {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0em;
      transition: width 10s linear;
      background-color: #ffffff;
      gap: 1em;
    }

    .now-playing__cover {
      position: fixed;
      z-index: -1;
      top: -1rem;
      right: -1rem;
      bottom: -1rem;
      left: -1rem;
      width: auto;
      height: auto;
      background-color: #000a;
      filter: contrast(.8) brightness(0.3);
      transform: rotate3d(1,1,1,0deg);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .now-playing__dazzler {
      position: fixed;
      z-index: -1;
      top: -1rem;
      right: -1rem;
      bottom: -1rem;
      left: -1rem;
      width: auto;
      height: auto;
      background-color: #000a;
      filter: blur(3px) contrast(.8) brightness(0.3);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}


.cloneImage {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: auto;
  height: auto;
}


.marquee {
  display: inline-block;
  animation: marquee 5s linear alternate infinite;
  white-space: nowrap;
}


@keyframes marquee {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(calc(-100% + 100vw), 0);
  }
}
</style>
