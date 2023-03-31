<template>
  <div class="queue">
    <header class="queue__head">UP NEXT</header>
    <div class="queue__items">
      <QueuedTrack v-for="(track,index) in tracks" :key="track" :index="index" :track="track"/>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { usePlayerStore } from "~/stores/player"
import { computed } from "#imports"
import QueuedTrack from "~/components/Queue/QueuedTrack.vue"

const tracks = computed(() => usePlayerStore().$state.currentQueue?.queue?.slice(0,8) || [])
const player = usePlayerStore()
</script>
<style lang="scss">
.queue {
  font-size: 0.8rem;
  position: relative;
  right: 0;
  bottom: 0;
  left: 0;
  width: auto;
  padding: 0.5rem;
  text-align: left;
  display: grid;
  gap:0.4em;
  height: fit-content;
  align-self: flex-end;
  &__head {
    font-size: 3em;
    font-weight: 200;
    line-height: 1;
    margin-bottom: 0.5em;
    margin-left: 1.5em;
    text-transform: uppercase;
  }
  &__items {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0.2rem;
  }
}
</style>
