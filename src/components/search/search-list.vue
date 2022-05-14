<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="item in searches" :key="item">
        <span class="text" @click="selectItem(item)">{{ item }}</span>
        <span class="icon" @click="deleteItem(item)">
          <i class="icon-delete" />
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
// props
defineProps({
  searches: {
    type: Array,
    default: () => []
  }
})

// emits
const emits = defineEmits(['select-item', 'delete-item'])

// methods
function selectItem(item) {
  emits('select-item', item)
}

function deleteItem(item) {
  emits('delete-item', item)
}
</script>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
