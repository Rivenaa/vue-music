import { getSongsUrl } from '@/api'
import { load, save } from '@/assets/js/storage'
/* 全局导入scss */
import '@/assets/scss/index.scss'
import { createApp } from 'vue'
import lazyPlugin from 'vue3-lazy'
import App from './App.vue'
import { FAVORITE_KEY, PLAY_KET } from './assets/js/constant'
import loadingDirective from './components/base/Loading/directive'
import noResultDirective from './components/base/no-result/directive'
import router from './router'
import store from './store'

const favoriteSongs = load(FAVORITE_KEY)

console.log(favoriteSongs)

if (favoriteSongs.length) {
  getSongsUrl(favoriteSongs).then(songs => {
    store.commit('music/setFavoriteList', songs)
    save(FAVORITE_KEY, songs)
  })
}

const historySongs = load(PLAY_KET)
if (historySongs.length) {
  getSongsUrl(historySongs).then(songs => {
    store.commit('music/setPlayHistory', songs)
    save(PLAY_KET, songs)
  })
}

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/images/default.png')
  })
  .directive('loading', loadingDirective)
  .directive('no-result', noResultDirective)
  .mount('#app')
