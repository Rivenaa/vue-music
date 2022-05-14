import { useStore } from 'vuex'
import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  ref,
  computed,
  watch,
  nextTick
} from 'vue'
import Scroll from '@/components/base/Scroll/index'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps({ ref: 'scrollRef' }, ctx.$props, {
        onScroll: e => {
          ctx.$emit('scroll', e)
        }
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const store = useStore()

    // computed
    const playList = computed(() => store.getters.playList)
    const scroll = computed(() => scrollRef.value.scroll)

    // watch
    watch(playList, async () => {
      await nextTick()
      scrollRef.value.scroll.refresh()
    })

    return { scrollRef, scroll }
  }
}
