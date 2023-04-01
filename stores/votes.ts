import { defineStore } from "pinia"
import { ref } from "vue"

export const useVotesStore = defineStore("votesStore", () => {
  const votes: Ref<{ [key: string]: number }> = ref({})
  const votesById: Ref<{ [key: number]: string[] }> = ref({})
  const setVotes = (updatedVotes: { [key: string]: number }) => {
    if (!updatedVotes || updatedVotes === votes.value) return
    votes.value = updatedVotes
    console.log("updatedVotes", updatedVotes)
    let mappedVotes: { [key: number]: string[] } = {}
    for (const [key, value] of Object.entries(updatedVotes)) {
      mappedVotes[value] ??= []
      mappedVotes[value].push(key)
    }
    console.log("mappedVotes", mappedVotes)
    votesById.value = mappedVotes
  }

  // For testing:
  // setVotes({
  //   "1": 1,
  //   "2": 1,
  //   "3": 1,
  //   "4": 6,
  //   "5": 6,
  //   "6": 6,
  //   "7": 6,
  // })

  return {
    votes,
    votesById,
    setVotes,
  }
})
