<template>
  <div class="suggest" v-loading:[loadingText]="loading" ref="rootRef">
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer && showSinger"
        @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine" />
        </div>
        <div class="name">
          <p class="text">{{ singer }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music" />
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullupLoading"></div>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, computed, nextTick, defineEmits } from 'vue'
import { search, getSongsUrl } from '@/api'
import usePullUpLoad from './usePullUpLoad'

// props
const props = defineProps({
  query: String,
  showSinger: {
    type: Boolean,
    default: true
  }
})

// emits
const emits = defineEmits(['select-song', 'select-singer'])

// data
const singer = ref(null)
const songs = ref([])
const page = ref(1)
const hasMore = ref(false)
const loadingText = ref('')
const manuaLoading = ref(false)

// computed
const loading = computed(() => !songs.value.length)
const pullupLoading = computed(() => isPullUpLoad.value && hasMore.value)
const preventPullUpLoad = computed(() => loading.value || manuaLoading.value)

// hooks
const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(
  searchMore,
  preventPullUpLoad
)

// watch
watch(
  () => props.query,
  async newQuery => {
    if (!newQuery) {
      return
    }
    await searchFirst()
  }
)

async function searchFirst() {
  if (!props.query) {
    return
  }
  singer.value = null
  songs.value = []
  page.value = 1
  hasMore.value = true

  const result = await search(props.query, page.value, props.showSinger)
  console.log(result)
  songs.value = await getSongsUrl(result.songs)
  singer.value = result.songs[0].singer
  hasMore.value = result.hasMore
  await nextTick()
  await makeItScrollable()
}

async function searchMore() {
  if (!hasMore.value || !props.query) {
    return
  }
  page.value++
  const result = await search(props.query, page.value, props.showSinger)
  songs.value = songs.value.concat(await getSongsUrl(result.songs))
  singer.value = result.songs[0].singer
  hasMore.value = result.hasMore
  await nextTick()
  await makeItScrollable()
}

async function makeItScrollable() {
  if (scroll.value.maxScrollY >= -1) {
    manuaLoading.value = true
    await searchMore()
    manuaLoading.value = false
  }
}

function selectSong(song) {
  emits('select-song', song)
}

function selectSinger(singer) {
  emits('select-singer', singer)
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
