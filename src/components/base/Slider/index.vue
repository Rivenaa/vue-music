<template>
  <div class="slider" ref="sliderRef">
    <div class="slider-group">
      <div class="slider-page" v-for="item in sliders" :key="item.id">
        <a :href="item.link">
          <img :src="item.pic" />
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{ active: currentPageIndex === index }"
      >
      </span>
    </div>
  </div>
</template>

<script setup>
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import {
  ref,
  defineProps,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated
} from 'vue'

BScroll.use(Slide)

defineProps({
  sliders: {
    type: Array,
    required: true
  }
})

const sliderRef = ref(null)
const slider = ref(null)
const currentPageIndex = ref(0)

onMounted(() => {
  slider.value = new BScroll(sliderRef.value, {
    click: true,
    scrollX: true,
    scrollY: false,
    momentum: false,
    bounce: false,
    probeType: 2,
    slide: true
  })

  slider.value.on('slideWillChange', page => {
    currentPageIndex.value = page.pageX
  })
})

onUnmounted(() => {
  slider.value.destroy()
})

onActivated(() => {
  slider.value.enable()
  slider.value.refresh()
})

onDeactivated(() => {
  slider.value.disable()
})
</script>

<style lang="scss" scoped>
.slider {
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-page {
      display: inline-block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      a {
        display: block;
        width: 100%;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots-wrapper {
    position: absolute;
    left: 50%;
    bottom: 12px;
    line-height: 12px;
    transform: translateX(-50%);
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      transform: translateZ(1px);
      border-radius: 50%;
      background: $color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
