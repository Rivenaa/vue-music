<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close" />
          </div>
        </div>
        <div class="search-input-wrapper">
          <Search-input v-model="query" placeholder="搜索歌曲" />
        </div>
        <div v-show="!query">
          <Switches :items="['最近播放', '搜索历史']" v-model="currentIndex" />
          <div class="list-wrapper">
            <Scroll
              v-if="currentIndex == 0"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <Song-list :songs="playHistory" @select="select" />
              </div>
            </Scroll>
            <Scroll
              v-if="currentIndex == 1"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <Search-list
                  :searches="searchHistory"
                  @select-item="addQuery"
                />
              </div>
            </Scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <Suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSong"
          />
        </div>
        <Message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok" />
            <span class="text">歌曲添加到播放列表</span>
          </div>
        </Message>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, defineExpose, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import useSearchHistory from '@/components/search/use-search-history'
import Message from '@/components/base/message'
import Suggest from '@/components/search/suggest'
import SearchInput from '@/components/search/search-input'
import SearchList from '@/components/search/search-list'
import Switches from '@/components/base/Switches'
import SongList from '@/components/base/SongList'
import Scroll from '@/components/base/Scroll'

const store = useStore()
const scrollRef = ref(null)
const messageRef = ref(null)
const visible = ref(false)
const query = ref('')
const currentIndex = ref(0)

// computed
const playHistory = computed(() => store.getters.playHistory)
const searchHistory = computed(() => store.getters.searchHistory)

// watch
watch(query, async () => {
  if (!query.value) {
    await nextTick()
    scrollRef.value.scroll.refresh()
  }
})

// hooks
const { saveSearch } = useSearchHistory()

// methods
const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
}

const addQuery = key => {
  query.value = key
}

const select = ({ song }) => {
  addSong(song)
  messageRef.value.show()
}

const selectSong = song => {
  saveSearch(`${song.singer}-${song.name}`)
  addSong(song)
  messageRef.value.show()
}

const addSong = song => {
  store.dispatch('music/addSong', song)
}

// expose
defineExpose({ show })
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
