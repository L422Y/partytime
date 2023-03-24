<script lang="ts" setup>
import { useAppStore } from '@/stores/app'
import { getCurrentInstance } from 'vue'
import { ISpotifyPlaylist } from '@/types/spotify'

const props = defineProps<{ playlist: ISpotifyPlaylist }>()
const app = getCurrentInstance()
const appStore = useAppStore()
const selectPlaylist = () => {
  appStore.setCurrentPlaylist(props.playlist)
  appStore.$state.showPlaylist = true
}

const selectUser = () => {
  app.emit('showUser', props.playlist)
}
</script>

<template>
  <li v-if="props.playlist.tracks && props.playlist.tracks.total > 3">
    <figure>
      <a :data-link="props.playlist.external_urls.spotify" target="_blank" @click="selectPlaylist">
        <img
          v-if="props.playlist.images[0]"
          :src="props.playlist.images[0].url"
          alt=""
          width="320"
        />
        <img v-else alt="" src="http://placekitten.com/320/320" width="320" />
      </a>
      <a :data-link="props.playlist.external_urls.spotify" target="_blank" @click="selectPlaylist">
        {{ props.playlist.name }}
      </a>
      <small>{{ props.playlist.tracks.total }} songs</small>
      <small
        >by
        <a :href="props.playlist.owner.external_urls.spotify" @click="selectUser">{{
          props.playlist.owner.id
        }}</a></small
      >
    </figure>
  </li>
</template>
