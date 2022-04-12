<template>
  <scroll class="index-list" :probeType="3" @scroll="onScroll">
    <ul ref="groupRef">
      <li class="group" v-for="group in data" :key="group.title">
        <h2 class="title">{{ group.title }}</h2>
        <ul>
          <li class="item" v-for="item in group.list" :key="item.id">
            <img class="avatar" v-lazy="item.pic" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
  </scroll>
</template>

<script setup>
import scroll from '@/components/base/Scroll'
import { ref, watch, computed, nextTick, defineProps } from 'vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const groupRef = ref(null)
const scrollY = ref(0)
const currentIndex = ref(0)
const listHeights = []
const distance = ref(0)
const TITLE_HEIGHT = 30

const fixedTitle = computed(() => {
  if (scrollY.value < 0) {
    return ''
  }
  const currentGroup = props.data[currentIndex.value]
  return currentGroup ? currentGroup.title : ''
})

const fixedStyle = computed(() => {
  const distanceVal = distance.value
  const diff =
    distanceVal > 0 && distanceVal < TITLE_HEIGHT
      ? distanceVal - TITLE_HEIGHT
      : 0
  return { transform: `translate3d(0,${diff}px,0)` }
})

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

const onScroll = pos => {
  scrollY.value = -pos.y
}

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
  console.log('listHeights', listHeights)
}
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
}
</style>
