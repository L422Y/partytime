<script lang="ts" setup>
import { useAppStore } from "@/stores/app"

const appStore = useAppStore()
const playlists = computed(() => appStore.playlists)
</script>

<template>
  <div v-if="appStore">
    <ul>
      <PlaylistTile
        v-for="playlist in playlists.items"
        :key="playlist.id"
        :playlist="playlist"
      />
    </ul>
  </div>
  <div
    v-else
    id="loading"
  >
    Loading playlists...
  </div>
</template>
<style lang="scss">
ul {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    cursor: pointer;

    figure {
      position: relative;
      display: block;
      overflow: hidden;
      width: 16.666vw;
      height: 16.666vw;
      margin: 0;
      @media (max-width: 1280px) {
        width: 25vw;
        height: 25vw;
      }
      @media (max-width: 960px) {
        width: 33.3333vw;
        height: 33.3333vw;
      }
      @media (max-width: 640px) {
        width: 50vw;
        height: 50vw;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        //transition: all 1.2s;
        //transform-origin: center center;
      }

      h3 {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 0.9rem;
        font-weight: normal;
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        box-sizing: border-box;
        width: 100%;
        margin: 0;
        padding: 1rem;
        white-space: nowrap;
        text-transform: uppercase;
        text-overflow: ellipsis;
        pointer-events: none;
        color: #ffffff;
        background: #2d311b;
        background-blend-mode: exclusion;
        mix-blend-mode: hard-light;

        a {
          text-decoration: none;
          pointer-events: all;
          color: #ffffff;
        }

        > a {
          font-size: 1.2rem;
          font-weight: bolder;
        }

        small {
          display: block;
        }
      }
    }

    figure {
      position: relative;

      &:before {
        position: absolute;
        z-index: 3;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
        content: " ";
        transition: background-color 0.5s;
        pointer-events: none;
        opacity: 1;
        background-color: #000000aa;
      }

      img {
        //transform: scale(1.2);
      }
    }

    &:hover {
      figure {
        &:before {
          background-color: #00000000;
        }

        img {
          //transform: scale(1.2);
        }
      }
    }
  }
}

</style>
