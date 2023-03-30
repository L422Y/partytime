<script lang="ts" setup>
import { getCurrentInstance } from "vue"
import { ISpotifyPlaylist } from "@/types/spotify"
import { usePlayerStore } from "~/stores/player"
import { useRoute } from "#app"

const {mode: initialMode} = withDefaults(defineProps<{ playlist?: ISpotifyPlaylist, mode: string }>(),
  {
    mode: "normal"
  }
)
const mode = ref(initialMode)
const app = getCurrentInstance()
const player = usePlayerStore()

const playerState = computed(() => player.$state)
const minimized = computed(() => player.$state?.nowPlayingMinimized)
const deviceType = computed(() => player.$state?.device?.type == "Computer" ? "desktop" : "mobile-phone")
const artists = computed(() => {
  if (playerState.value.item?.artists) {
    return playerState.value.item?.artists
      .map((artist) => artist.name)
      .join(", ")
  }
})

const toggleBigMode = () => {

  if (useRoute().path !== "/now-playing") {
    useRouter().push("/now-playing")
  } else {
    useRouter().push("/")
  }
}

</script>
<template>
  <div v-if="playerState.device" :class="[minimized && !(mode === 'big') ? 'minimized' : '', mode ]"
       class="now-playing"
       @click="toggleBigMode">
    <aside class="now-playing__inside">
      <header class="now-playing__head">Now Playing</header>
      <div class="now-playing__what">
        <span v-if="mode === 'normal'">
          {{ playerState.item?.name }} - {{ artists }}
        </span>
        <div v-else-if="mode === 'big'">
          <div class="now-playing__track">
            {{ playerState.item?.name }}
          </div>
          <div class="now-playing__artists">
            {{ artists }}
          </div>
        </div>
        <span v-if="mode === 'normal'" class="now-playing__album">
          {{ playerState.item?.album?.name }} -
          {{ playerState.item?.album?.release_date }}
        </span>
        <div v-if="mode === 'big'" class="now-playing__album">
          <div>{{ playerState.item?.album?.name }}</div>
          /
          <div>{{ playerState.item?.album?.release_date }}</div>
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
    max-width: 50%;

    display: grid;
    padding: 1em;
    transform: translateX(-50%);
    background-color: #000a;
    gap: 1em;
  }

  &.big {
    font-size: clamp(1rem, 5vw, 5rem);
    top: 0;
    right: 0;
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
      display: block;
      width: fit-content;
      max-width: calc(100vw - 4em);
      padding: 2em;
      transform: none;
      text-align: center;
      background-color: #000a;
      gap: 1em;
    }

    .now-playing__what {
      font-size: 1.7em;
      filter: drop-shadow(0 0 100px #000);
    }

    .now-playing__track {
      font-size: 1.4em;
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
      flex-direction: row;
      justify-content: center;
    }

    .now-playing__device {
      display: none;
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
      filter: blur(3px) contrast(.8) brightness(0.5);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
