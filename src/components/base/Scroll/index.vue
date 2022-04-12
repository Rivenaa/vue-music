<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>

<script setup>
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

import { ref, defineEmits, defineProps, onMounted } from 'vue'

/* 检测组件高度及宽度变化 */
BScroll.use(ObserveDOM)

const props = defineProps({
  click: {
    type: Boolean,
    default: true
  },
  probeType: {
    type: Number,
    default: 0
  }
})
/* 组件自定义事件 */
const emits = defineEmits(['scroll'])
const scroll = ref(null)
onMounted(() => {
  scroll.value = new BScroll(scroll.value, { observeDOM: true, ...props })
  const scrollVal = scroll.value
  if (props.probeType > 0) {
    scrollVal.on('scroll', pos => {
      emits('scroll', pos)
    })
  }
})
</script>

<style lang="scss" scoped></style>
