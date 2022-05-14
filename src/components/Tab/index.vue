<template>
  <div class="tab">
    <router-link
      class="tabs-item"
      v-for="item in tabs"
      :key="item.name"
      :to="item.path"
    >
      <span class="tab-link">{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tabs = ref([
  {
    name: '推荐',
    path: '/recommend'
  },
  {
    name: '歌手',
    path: '/singer'
  },
  {
    name: '排行',
    path: 'top-list'
  },
  {
    name: '搜索',
    path: '/search'
  }
])
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;

  .tabs-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
    }

    &.router-link-active {
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
