<script setup>
import { onMounted, ref } from 'vue';
import ItemStackPage from './pages/ItemStackPage.vue';
import ItemViewerPage from './pages/ItemViewerPage.vue';
import PreferencesPage from './pages/PreferencesPage.vue';
import { resetKeys } from '../keyshortcuts';

const currentPage = ref('ItemStackPage');
const clip = ref({});
/** @type {string[]} */
const pageStack = [];

const pages = {
  ItemStackPage,
  ItemViewerPage,
  PreferencesPage,
};

/**
 * @param {string} page
 */
function pushPage(page, clipObj) {
  pageStack.push(page);
  resetKeys();
  currentPage.value = page;
  clip.value = clipObj;
}

/**
 * @returns {string}
 */
function popPage() {
  pageStack.pop();
  const page = pageStack[pageStack.length - 1];
  resetKeys();
  currentPage.value = page;
  return page;
}

onMounted(() => pushPage('ItemStackPage'));
</script>

<template>
  <component
    :is="pages[currentPage]"
    :clip="clip"
    @open-page="pushPage"
    @close-page="popPage"
  >
  </component>
</template>
