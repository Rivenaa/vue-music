<template>
  <Scroll class="index-list" :probeType="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
      <li class="group" v-for="group in data" :key="group.title">
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li
            class="item"
            v-for="item in group.list"
            :key="item.id"
            @click="onItemClick(item)"
          >
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :data-index="index"
          :key="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script setup>
import Scroll from '@/components/wrap-scroll'
import {
  ref,
  watch,
  computed,
  nextTick,
  defineProps,
  defineEmits,
  defineExpose
} from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['select'])
const scrollRef = ref(null)
const groupRef = ref(null)
const scrollY = ref(0)
const currentIndex = ref(0)
const distance = ref(0) // distance 距离
const listHeights = []

watch(
  /* 监听data的变化 */
  () => props.data,
  async () => {
    /* 等待DOM发生变化，调用culculate方法 */
    await nextTick()
    /* 获取整个列表的高度 */
    culculate()
  }
)

watch(scrollY, newY => {
  /* 监听newY所在的区间 得到currentIndex */
  for (let i = 0; i < listHeights.length - 1; i++) {
    const heightTop = listHeights[i]
    const heightBottom = listHeights[i + 1]
    if (newY >= heightTop && newY <= heightBottom) {
      currentIndex.value = i
      distance.value = heightBottom - newY
    }
  }
})

/* 调用onScroll事件 获取Y值 */
const onScroll = pos => {
  scrollY.value = -pos.y
}

/* 计算列表高度 */
const culculate = () => {
  /* 每个children 对应 groupRef 下的每一个DOM */
  const list = groupRef.value.children
  let height = 0

  /* 初始化 */
  listHeights.length = 0
  listHeights.push(height)

  /* 列表的高度 */
  for (let i = 0; i < list.length; i++) {
    /* 遍历 拿到每一项的内容高度 */
    height += list[i].clientHeight
    listHeights.push(height)
  }
}

/* 固定标题-文本 */
const fixedTitle = computed(() => {
  if (scrollY.value < 0) {
    return ''
  }
  const currentGroup = props.data[currentIndex.value]
  return currentGroup ? currentGroup.title : ''
})

/* 固定标题-向上移动样式 */
const TITLE_HEIGHT = 30

const fixedStyle = computed(() => {
  const distanceVal = distance.value
  const diff =
    distanceVal > 0 && distanceVal < TITLE_HEIGHT
      ? distanceVal - TITLE_HEIGHT
      : 0
  return { transform: `translate3d(0,${diff}px,0)` }
})

/* shortcutList */
const ANCHOR_HEIGHT = 18
const touch = { pageY: 0, anchorIndex: 0 }

/* 快速导航列表 */
const shortcutList = computed(() => {
  return props.data.map(group => {
    return group.title
  })
})

/* shortcutList 触摸点击事件 */
const onShortcutTouchStart = e => {
  // anchor 锚点
  const anchorIndex = parseInt(e.target.dataset.index)

  touch.pageY = e.touches[0].pageY
  touch.anchorIndex = anchorIndex

  scrollTo(anchorIndex)
}

/* shortcutList 触摸移动事件 */
const onShortcutTouchMove = e => {
  const delta = ((e.touches[0].pageY - touch.pageY) / ANCHOR_HEIGHT) | 0
  const anchorIndex = touch.anchorIndex + delta

  scrollTo(anchorIndex)
}

/* 调用scrollToElement方法 */
const scrollTo = index => {
  if (isNaN(index)) return
  index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
  const targetEl = groupRef.value.children[index]
  scrollRef.value.scroll.scrollToElement(targetEl, 0)
}

const onItemClick = item => {
  emits('select', item)
}

defineExpose({ onItemClick })
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
