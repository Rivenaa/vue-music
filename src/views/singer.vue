<template>
  <div class="singer-cantainer" v-loading="!singers.length">
    <index-list :data="singers"></index-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getSingerList } from '@/api'
import IndexList from '@/components/base/IndexList'

const singers = ref([])
getSingerList().then(res => {
  const list = res.singers
  singers.value = list
  console.log(list, res)
})
</script>

<style lang="scss" scoped>
.singer-cantainer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
