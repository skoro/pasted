<script setup>
import { ref } from 'vue';
import ItemStack from './ItemStack.vue';
import ItemViewer from './ItemViewer.vue';
import PagePreferences from './PagePreferences.vue';
import { resetKeys } from '../keyshortcuts';

const currentPage = ref('ItemStack');
const clip = ref({});

const pages = {
  ItemStack,
  ItemViewer,
  PagePreferences,
};

function changePageTo(pageName) {
  resetKeys();
  currentPage.value = pageName;
}

function onPageViewer(clipArg) {
  changePageTo('ItemViewer');
  clip.value = clipArg;
}
</script>

<template>
  <component
    :is="pages[currentPage]"
    :clip="clip"
    @close-page="changePageTo('ItemStack')"
    @page-viewer="onPageViewer"
    @page-prefs="changePageTo('PagePreferences')"
  >
  </component>
</template>
