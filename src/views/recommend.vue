<template>
  <div>
    <slider :sliders="sliders" v-if="sliders.length"></slider>
  </div>
</template>

<script>
import { getRecommend } from '@/api'
import Slider from '@/components/base/Slider'
export default {
  components: {
    Slider
  },
  daata() {
    return {
      sliders: []
    }
  },
  name: 'recommend',
  async created() {
    const result = await getRecommend()

    this.sliders = result.sliders
    console.log(this.sliders)
  }
}
</script>

<style></style>
