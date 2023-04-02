<template>
  <div :class="[`meter--${props.meterStyle}`]" :data-tick="props.tick" class="meter">
    <div v-if="label" class="meter__label" v-html="label"/>
    <div v-if="props.meterStyle === 'horizontal'" class="meter__indicator">
      <span
        :style="labelStyles"
        class="meter__value"
        v-html="valueLabel"
      ></span>
      <span :style="styleObject" class="meter__bar"></span>
    </div>
    <div v-else-if="props.meterStyle === 'round'" class="meter__indicator">
      <svg
        id="svg"
        class="meter__bar"
        viewBox="0 0 100 100"
        viewPort="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          id="track"
          :style="{
            stroke: '#ffffff55'
          }"
          cx="50"
          cy="50"
          fill="none"
          r="45"
          stroke-dasharray="0"
          stroke-width="10"
        ></circle>
        <circle
          id="bar"
          :style="{
            strokeDashoffset: 280 - meterConfig.value * 280,
            stroke: meterConfig.color,
          }"
          cx="50"
          cy="50"
          r="45"
          stroke-dasharray="280"
          stroke-width="10"
        ></circle>
      </svg>
    </div>
  </div>
</template>
<script lang="ts" setup>
let props = withDefaults(
  defineProps<{
    fn?: any;
    value: any;
    label?: string;
    tick?: any;
    meterStyle?: "horizontal" | "vertical" | "round";
  }>(),
  {
    value: 0,
    meterStyle: "horizontal",
  }
)

const defaultHandler = (input) => {
  let color = "#ffffff"
  input = 100 - input
  switch (true) {
    case input < 25:
      color = "red"
      break
    case input < 50:
      color = "orange"
      break
    case input < 75:
      color = "yellow"
      break
    default:
      color = "green"
  }
  return {color, value: input / 100}
}

const valueLabel = computed(
  () => meterConfig?.value.text || props.value?.value || props.value
)
const labelStyles = computed(() => meterConfig.value?.labelStyles)
const strokeDashoffset = 10

const meterConfig = computed(() => {
  return typeof handler?.value === "function"
    ? handler.value(props.value?.value ?? props.value)
    : typeof handler === "function"
      ? handler(props.value?.value ?? props.value)
      : {}
})

const handler = computed(() => {
  let h = typeof props.fn === "function" ? props.fn : props.fn?.value
  h ||= defaultHandler
  return h
})

const styleObject = computed(() => {
  if (props.meterStyle === "round") {
    return {
      background: meterConfig.value?.color || "#ffffff",
      width: `${( meterConfig.value?.value || 0 ) * 100}%`,
      ...meterConfig.value?.styles,
    }
  } else {
    return {
      background: meterConfig.value?.color || "#ffffff",
      width: `${( meterConfig.value?.value || 0 ) * 100}%`,
      ...meterConfig.value?.styles,
    }
  }
})
</script>
<style lang="scss">
.meter {
  &__indicator {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 1.9rem;
  }

  &__value {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: inherit;
    color: #fff;
    mix-blend-mode: difference;
  }

  &--horizontal {
    .meter {
      &__bar {
        display: inline-block;
        box-sizing: border-box;
        width: 0;
        min-width: 1px;
        height: 100%;
        padding: 0.25rem;
        transition: all 0.5s;
        background: #fafafa;
      }
    }
  }

  &--round {
    position: relative;
    width: 2rem;
    height: 2rem;
    transform: rotate(-90deg);
    border-radius: 0;

    .meter {
      &__value {
        font-size: 2rem;
      }

      &__indicator {
        overflow: visible;
        box-sizing: border-box;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }

      &__bar {
        width: 100%;
        height: 100%;
        transition: all 0.5s;
        transform: rotate(90deg);
        stroke-dasharray: 251;
        stroke-dashoffset: 251;

        circle {
          transition: all .2s, stroke 1.3s;
        }
      }
    }
  }
}
</style>
