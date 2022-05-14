import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import {
  computed,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import { useStore } from 'vuex'

BScroll.use(Slide)

export default function useMiniSlider(wrapperRef) {
  const store = useStore()
  const slider = ref(null)
  const fullScreen = computed(() => store.getters.fullScreen)
  const playList = computed(() => store.getters.playList)
  const currentIndex = computed(() => store.getters.currentIndex)

  // slider 触发条件
  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value
  })

  onMounted(() => {
    let sliderVal

    // 监听 sliderShow  生成slider实例
    watch(sliderShow, async newSliderShow => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(wrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false, // 推进
            bounce: false, // 反弹
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })

          // 调用事件 把切换后的歌曲索引值存入vuex中
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('music/setCurrentIndex', pageX)
          })
        } else {
          sliderVal.refresh() // refresh 刷新
        }
        // 实例生成展示当前歌曲
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 监听歌曲索引值，展示当前歌曲
    watch(currentIndex, newIndex => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    watch(playList, async newList => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
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

  return { slider }
}
