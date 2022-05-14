<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playList.length"
        @click.stop="hide"
      >
        <div class="list-wrapper">
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click.stop="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear" />
              </span>
            </h1>
          </div>
          <Scroll class="list-content" ref="scrollRef">
            <transition-group ref="ulRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in playList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)" />
                <span class="text">{{ song.name }} </span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)" />
                </span>
                <span
                  class="delete"
                  :class="{ disable: removing }"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete" />
                </span>
              </li>
            </transition-group>
          </Scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add" />
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
        <Confirm
          ref="confirmRef"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
          @confirm="confirmClear"
        />
        <Add-song ref="addSongRef" />
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, computed, defineExpose, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import Scroll from '@/components/base/Scroll'
import Confirm from '@/components/base/confirm'
import AddSong from '@/components/addSong'

const store = useStore()

// el
const scrollRef = ref(null)
const ulRef = ref(null)
const confirmRef = ref(null)
const addSongRef = ref(null)

// data
const visible = ref(false)
const removing = ref(false)

// computed
const playList = computed(() => store.getters.playList)
const currentSong = computed(() => store.getters.currentSong)

// hooks
const { modeIcon, modeText, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

// watch
watch(currentSong, async newSong => {
  if (!visible.value || !newSong.id) {
    return
  }
  await nextTick()
  scrollToCurrent()
})

// method
const show = async () => {
  visible.value = true
  await nextTick()
  refreshScroll()
  scrollToCurrent()
}

const hide = () => {
  visible.value = false
}

const getCurrentIcon = song => {
  if (song.id === currentSong.value.id) {
    return 'icon-play'
  }
}

const refreshScroll = () => {
  scrollRef.value.scroll.refresh()
}

const scrollToCurrent = () => {
  const index = playList.value.findIndex(item => {
    return item.id === currentSong.value.id
  })
  if (index === -1) {
    return
  }
  const target = ulRef.value.$el.children[index]
  scrollRef.value.scroll.scrollToElement(target, 300)
}

const selectItem = song => {
  const index = playList.value.findIndex(item => {
    return item.id === song.id
  })
  store.commit('music/setCurrentIndex', index)
  store.commit('music/setPlaying', true)
}

const removeSong = song => {
  if (removing.value) {
    return
  }
  removing.value = true
  store.dispatch('music/removeSong', song)
  if (!playList.value.length) {
    hide()
  }
  setTimeout(() => {
    removing.value = false
  }, 200)
}

const showConfirm = () => {
  confirmRef.value.show()
}

const confirmClear = () => {
  store.dispatch('music/playListClear')
  hide()
}

const showAddSong = () => {
  addSongRef.value.show()
}

// expose
defineExpose({ show })
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.5s;
    .list-wrapper {
      transition: all 0.5s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
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
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
