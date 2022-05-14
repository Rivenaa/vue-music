<template>
  <div class="album">
    <Music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></Music-list>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { getAlbum } from '@/api'
import { ALBUM_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'
import MusicList from '@/components/MusicList'

// props
const props = defineProps({ data: Object })

// hooks
const { songs, title, pic, loading } = createDetailComponent(
  props,
  ALBUM_KEY,
  getAlbum
)
</script>

<style lang="scss" scoped>
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-background;
}
</style>
