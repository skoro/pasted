<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ToolButton from './forms/ToolButton.vue';
import IconTrash from './icons/IconTrash.vue';
import IconStarOutline from './icons/IconStarOutline.vue';
import IconStarSolid from './icons/IconStarSolid.vue';
import IconImageOutline from './icons/IconImageOutline.vue';
import IconImageSolid from './icons/IconImageSolid.vue';
import IconPreferences from './icons/IconPreferences.vue';
import { useClipboardStore } from '../stores/useClipboardStore';
import { keyboard, bindKey } from '../keyshortcuts';

const emit = defineEmits(['open-prefs']);

const clipboardStore = useClipboardStore();
const { onlyStarred, withImages } = storeToRefs(clipboardStore);

const hasClips = computed(() => clipboardStore.clips.length > 0);
const hasImages = computed(() => clipboardStore.images.length > 0);
const hasStarred = computed(() => clipboardStore.starred.length > 0);

function clear() {
  if (!hasClips.value) {
    return false;
  }

  let msg;
  let clearCallback;

  if (onlyStarred.value && withImages.value) {
    msg = 'Are you sure you want to remove starred images ?';
    clearCallback = (item) => item.starred && item.image;
  } else if (onlyStarred.value) {
    msg = 'Are you sure you want to remove starred items ?';
    clearCallback = (item) => item.starred;
  } else if (withImages.value) {
    msg = 'Are you sure you want to remove images ?';
    clearCallback = (item) => item.image && !item.starred;
  } else {
    msg = 'Are you sure you want to remove items ?';
    clearCallback = (item) => !item.starred;
  }

  if (confirm(msg)) {
    clipboardStore.clear(clearCallback);
    window.electronAPI.clearList();
    if (onlyStarred.value && !hasClips.value) {
      onlyStarred.value = false;
    }
    if (withImages.value && !hasImages.value) {
      withImages.value = false;
    }
  }

  return false;
}

onMounted(() => {
  bindKey(keyboard.toggleStarred, () => { onlyStarred.value = hasStarred.value ? !onlyStarred.value : false; });
  bindKey(keyboard.toggleImages, () => {
    withImages.value = hasImages.value ? !withImages.value : false;
  });
  bindKey(keyboard.removeItems, clear);
  bindKey(keyboard.openPrefs, () => emit('open-prefs'));
});
</script>

<template>
    <div
        class="fixed flex flex-row bottom-0 left-0 h-11 w-full bg-gray-200 space-x-4 justify-center items-center text-gray-600">
        <ToolButton class="w-8 h-8" v-if="hasStarred" @click="onlyStarred = !onlyStarred">
            <IconStarSolid v-if="onlyStarred" />
            <IconStarOutline v-else />
        </ToolButton>
        <ToolButton class="w-8 h-8" v-if="hasImages" @click="withImages = !withImages">
            <IconImageSolid v-if="withImages" />
            <IconImageOutline v-else />
        </ToolButton>
        <ToolButton class="w-8 h-8" v-if="hasClips" @click="clear">
            <IconTrash />
        </ToolButton>
        <ToolButton class="w-8 h-8" @click="$emit('open-prefs')">
            <IconPreferences />
        </ToolButton>
    </div>
</template>
