import { getSongsUrl } from '@/api'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onBeforeMount } from 'vue'
import storage from 'good-storage'

export default function createDetailComponent(props, key, fetch) {
  const route = useRoute()
  const router = useRouter()

  // data
  const songs = ref([])
  const loading = ref(true)

  // computed
  const computedData = computed(() => {
    let ret = null
    const data = props.data
    if (data) {
      ret = data
    } else {
      const cachedData = storage.session.get(key)
      ret = cachedData
    }
    return ret
  })

  const pic = computed(() => {
    const data = computedData.value
    return data && data.pic
  })

  const title = computed(() => {
    const data = computedData.value
    return data && (data.name || data.title)
  })

  onBeforeMount(async () => {
    const data = computedData.value
    if (!data) {
      const path = route.matched[0].path
      router.push({ path })
      return
    }
    const res = await fetch(data)
    songs.value = await getSongsUrl(res.songs)
    loading.value = false
  })

  return { songs, title, pic, loading }
}
