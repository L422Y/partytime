<template>
    <div style="font-size: 1rem">
        <div v-for="track in currentQueueTracks" :key="track.id" class="queue__track">
            VOTES {{ votesStore.$state.votesById[track.originalIndex+1]?.length || 0 }} -- IDX {{track.index}} -- OIDX
            {{track.originalIndex}} -- {{track.track.name}}
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useVotesStore } from "~/stores/votes"

const votesStore = useVotesStore()
const currentQueueTracks = useState("currentQueueTracks", () => [])
</script>
