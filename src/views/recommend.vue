<template>
  <div>推荐</div>
</template>

<script>
import { getRecommend } from '@/api'
export default {
  name: 'recommend',
  async created() {
    const result = await getRecommend()
    console.log(result)
  }
}
</script>

<style></style>
