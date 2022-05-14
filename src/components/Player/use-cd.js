import { useStore } from 'vuex'
import { ref, watch, computed } from 'vue'

export default function useCD() {
  const store = useStore()
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const playing = computed(() => store.getters.playing)
  const cdCls = computed(() => (playing.value ? 'playing' : ''))

  watch(playing, newplaying => {
    /* 如果点击了暂停按钮 ， 将同步旋转角度 */
    if (!newplaying) {
      syncTransform(cdRef, cdImageRef)
    }
  })

  function syncTransform(wrapper, inner) {
    const innerTransform = getComputedStyle(inner.value).transform
    if (wrapper.value.style.transform === 'none') {
      wrapper.value.style.transform = innerTransform
    } else {
      wrapper.value.style.transform += innerTransform
    }
  }

  return { cdRef, cdImageRef, cdCls }
}
