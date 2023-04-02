import { defineStore } from "pinia"
import { ref } from "vue"

export const useVotesStore = defineStore("votesStore", () => {
  const votes: Ref<{ [key: string]: string }> = ref({})
  const votesById: Ref<{ [key: string]: string[] }> = ref({})
  const setVotes = (updatedVotes: { [key: string]: string }) => {
    if (!updatedVotes || updatedVotes === votes.value) return
    votes.value = updatedVotes
    let mappedVotes: { [key: string]: string } = {}
    for (const [key, value] of Object.entries(updatedVotes)) {
      mappedVotes[value] ??= []
      mappedVotes[value].push(key)
    }
    votesById.value = mappedVotes
  }

  return {
    votes,
    votesById,
    setVotes,
  }
})
