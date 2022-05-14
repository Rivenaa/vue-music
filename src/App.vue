<template>
  <Navbar />
  <Tab />
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view :style="viewStyle" name="user" v-slot="{ Component }">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <Player />
</template>
<script setup>
import Navbar from '@/components/Navbar'
import Tab from '@/components/Tab'
import Player from '@/components/Player/player'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// computed
const playList = computed(() => store.getters.playList)
const viewStyle = computed(() => {
  const bottom = playList.value.length ? '60px' : '0'
  return { bottom }
})
</script>
<style lang="scss"></style>
