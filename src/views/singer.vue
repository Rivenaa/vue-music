<template>
  <div class="singer-cantainer" v-loading="!singers.length">
    <Index-list @select="selectSinger" :data="singers" />
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getSingerList } from '@/api'
import { SINGER_KEY } from '@/assets/js/constant'
import router from '@/router'
import storage from 'good-storage'
import IndexList from '@/components/IndexList'

const singers = ref([])
const selectedSinger = ref(null)

getSingerList().then(res => {
  singers.value = res.singers
})

const selectSinger = singer => {
  storage.session.set(SINGER_KEY, singer)
  selectedSinger.value = singer
  router.push(`/singer-detail/${singer.mid}`)
}
</script>

<style lang="scss" scoped>
.singer-cantainer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
