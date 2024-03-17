<script setup>
import ItemStack from './ItemStack.vue'
import ItemViewer from './ItemViewer.vue'
import PagePreferences from './PagePreferences.vue'
import { ref } from 'vue'

const currentPage = ref('ItemStack')
const clip = ref({})

const pages = {
  ItemStack,
  ItemViewer,
  PagePreferences,
}

function onPageViewer(clipArg) {
  currentPage.value = 'ItemViewer'
  clip.value = clipArg
}
</script>

<template>
  <KeepAlive>
    <component
      :is="pages[currentPage]"
      :clip="clip"
      @close-page="currentPage = 'ItemStack'"
      @page-viewer="onPageViewer"
      @page-prefs="currentPage = 'PagePreferences'"
    >
    </component>
</KeepAlive>
</template>
