<template>
  <div class="progress-bar" ref="progressBarRef" @click="onClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  defineProps,
  defineEmits,
  defineExpose
} from 'vue'

// props
const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})

// emits
const emits = defineEmits(['progress-changing', 'progress-changed'])

// el
const progressBarRef = ref(null)
const progressRef = ref(null)

// data
const offset = ref(0) // 偏移量
const progressBtnWidth = 16
const touch = { pageX: 0, beginWidth: 0 }

// computed
const progressStyle = computed(() => `width:${offset.value}px`)
const btnStyle = computed(() => `transform:translate3d(${offset.value}px,0,0)`)
const progress = computed(() => props.progress)

// watch
watch(progress, newProgress => {
  setOffset(newProgress)
})

// methods
const onTouchStart = e => {
  touch.pageX = e.touches[0].pageX // 圆点初始位置
  touch.beginWidth = progressRef.value.clientWidth
}

const onTouchMove = e => {
  const delta = e.touches[0].pageX - touch.pageX
  const tempWidth = touch.beginWidth + delta
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth // 进度条总长度
  const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
  offset.value = barWidth * progress
  emits('progress-changing', progress)
}

const onTouchEnd = () => {
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth // 进度条总长度
  const progress = progressRef.value.clientWidth / barWidth
  emits('progress-changed', progress)
}

const onClick = e => {
  const rectObject = progressBarRef.value.getBoundingClientRect()
  const tempWidth = e.pageX - rectObject.left // rectObject.left 元素到浏览器左边的距离
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth // 进度条总长度
  const progress = tempWidth / barWidth
  emits('progress-changed', progress)
}

const setOffset = progress => {
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth // 进度条总长度
  offset.value = barWidth * progress
}

// expose
defineExpose({ setOffset })
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background-color: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
