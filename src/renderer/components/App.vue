<script setup>
import { onMounted, ref } from 'vue';
import ItemStackPage from './pages/ItemStackPage.vue';
import ItemViewerPage from './pages/ItemViewerPage.vue';
import PreferencesPage from './pages/PreferencesPage.vue';
import QrCodePage from './pages/QrCodePage.vue';
import { resetKeys, bindKey, keyboard } from '../keyshortcuts';

const currentPage = ref('ItemStackPage');
const clip = ref({});
/** @type {string[]} */
const pageStack = [];

const pages = {
  ItemStackPage,
  ItemViewerPage,
  PreferencesPage,
  QrCodePage,
};

/**
 * Registers the window keyboard shortcuts.
 */
function registerAppKeys() {
  bindKey(keyboard.hideWindow, () => window.electronAPI.willHideWindow());
}

/**
 * @param {string} page
 */
function pushPage(page, clipObj) {
  registerAppKeys();
  pageStack.push(page);
  currentPage.value = page;
  clip.value = clipObj;
}

/**
 * @returns {string}
 */
function popPage() {
  pageStack.pop();
  // FIXME: pageStack can be empty for some reason.
  const page = pageStack[pageStack.length - 1];
  resetKeys();
  registerAppKeys();
  currentPage.value = page;
  return page;
}

function onStart() {
  pushPage('ItemStackPage');
  registerAppKeys();
}

onMounted(onStart);
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
