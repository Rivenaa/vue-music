<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script setup>
import useScroll from './use-scroll'
import { ref, defineEmits, defineProps, defineExpose } from 'vue'

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
const rootRef = ref(null)
const scroll = useScroll(rootRef, props, emits)

defineExpose({ scroll })
</script>
