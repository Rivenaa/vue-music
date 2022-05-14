<template>
  <div class="search">
    <div class="search-input-wrapper">
      <Search-input v-model="query"></Search-input>
    </div>
    <Scroll class="search-contant" v-show="!query" ref="scrollRef">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showComfirm"
              ><i class="icon-clear"
            /></span>
          </h1>
          <Comfirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          />
          <Search-list
            :searches="searchHistory"
            @select-item="selectItem"
            @delete-item="deleteItem"
          />
        </div>
      </div>
    </Scroll>
    <div class="search-result" v-show="query">
      <Suggest :query="query" @select-song="selectSong" />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { getHotKeys } from '@/api'
import useSearchHistory from '@/components/search/use-search-history'
import Comfirm from '@/components/base/confirm'
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import SearchList from '@/components/search/search-list'
import Scroll from '@/components/wrap-scroll/index'

const store = useStore()
const query = ref('')
const hotKeys = ref([])
const scrollRef = ref(null)
const confirmRef = ref(null)

const searchHistory = computed(() => store.getters.searchHistory)

getHotKeys().then(res => {
  hotKeys.value = res.hotKeys
})

// hooks
const { saveSearch, removeSearch, clearSearch } = useSearchHistory()

// methods
function addQuery(key) {
  query.value = key
}

// watch
watch(query, async () => {
  await nextTick()
  scrollRef.value.scroll.refresh()
})

function selectSong(song) {
  saveSearch(`${song.singer}-${song.name}`)
  store.dispatch('music/addSong', song)
}

function selectItem(item) {
  query.value = item
}

function deleteItem(item) {
  removeSearch(item)
}

function showComfirm() {
  confirmRef.value.show()
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-contant {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
