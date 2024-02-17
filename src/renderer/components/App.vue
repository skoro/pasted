<script setup>
import ItemStack from './ItemStack.vue'
import ItemViewer from './ItemViewer.vue'
import { ref } from 'vue'

const currentPage = ref('ItemStack')
const clip = ref({})

const pages = {
  ItemStack,
  ItemViewer,
}

function onClosePage() {
  currentPage.value = 'ItemStack'
}

function onPageViewer(clipArg) {
  currentPage.value = 'ItemViewer'
  clip.value = clipArg
}
</script>

<template>
  <component
    :is="pages[currentPage]"
    :clip="clip"
    @close-page="onClosePage"
    @page-viewer="onPageViewer"
  >
  </component>
</template>
