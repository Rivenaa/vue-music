<template>
  <div class="singer-detail">
    <Music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      rank
    ></Music-list>
  </div>
</template>

<script setup>
import createDetailComponent from '@/assets/js/create-detail-component'
import { TOP_KEY } from '@/assets/js/constant'
import { getTopDetail } from '@/api'
import { defineProps } from 'vue'
import MusicList from '@/components/MusicList'

// props
const props = defineProps({
  data: Object
})

// hooks
const { songs, title, pic, loading } = createDetailComponent(
  props,
  TOP_KEY,
  getTopDetail
)
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
