<template>
  <div class="voting-info">
    <span class="voting-info__description">
      <template v-if="number">
        TEXT <strong>?</strong> to <span class="voting-info__number">{{ number }}</span>
      </template>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useAppStore } from "~/stores/app"
import { usePhoneNumberFormatter } from "~/composables/usePhoneNumberFormatter"

const appStore = useAppStore()
const number = computed(() => {
  if (!appStore.$state.smsNumber) return null
  return usePhoneNumberFormatter(appStore.$state.smsNumber)
})
</script>

<style lang="scss" scoped>
.voting-info {
  &__description {
    color: #eeeeee;

  }
  &__number {
    margin-bottom: 1rem;
    font-weight: bold;
    color: #ffffff;
  }
}



</style>
