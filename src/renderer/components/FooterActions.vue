<script setup>
import { ref, computed, onMounted } from 'vue';
import Mousetrap from 'mousetrap';
import ToolButton from './ToolButton.vue';
import IconTrash from './icons/IconTrash.vue';
import IconStarOutline from './icons/IconStarOutline.vue';
import IconStarSolid from './icons/IconStarSolid.vue';
import IconImageOutline from './icons/IconImageOutline.vue';
import IconImageSolid from './icons/IconImageSolid.vue';
import { useClipboardStore } from '../stores/useClipboardStore';
import { keyboard } from '../keyshortcuts';

const clipboardStore = useClipboardStore()

const hasClips = computed(() => clipboardStore.clips.length > 0)
const hasImages = computed(() => clipboardStore.images.length > 0)

const showStarred = ref(false)
const showImages = ref(false)

onMounted(() => {
    Mousetrap.bind(keyboard.toggleFavorites, toggleStarred)
    Mousetrap.bind(keyboard.toggleImages, toggleImages)
})

function clear() {
    if (!hasClips.value) {
        return
    }
    
    let msg
    let clearCallback

    if (showStarred.value && showImages.value) {
        msg = 'Are you sure you want to remove starred images ?'
        clearCallback = (item) => item.starred && item.image
    } else if (showStarred.value) {
        msg = 'Are you sure you want to remove starred items ?'
        clearCallback = (item) => item.starred
    } else if (showImages.value) {
        msg = 'Are you sure you want to remove images ?'
        clearCallback = (item) => item.image && !item.starred
    } else {
        msg = 'Are you sure you want to remove items ?'
        clearCallback = (item) => ! item.starred
    }

    if (confirm(msg)) {
        clipboardStore.clear(clearCallback)
        window.electronAPI.clearList()
        if (showStarred.value && ! hasClips.value) {
            toggleStarred()
        }
    }
}

function toggleStarred() {
    showStarred.value = !showStarred.value
    clipboardStore.onlyStarred = showStarred.value
}

function toggleImages() {
    showImages.value = !showImages.value
    clipboardStore.withImages = showImages.value
}
</script>

<template>
    <div class="fixed flex flex-row bottom-0 left-0 h-11 w-full bg-gray-200 space-x-4 justify-center items-center text-gray-600">
        <ToolButton class="w-8 h-8" @click="toggleStarred">
            <IconStarSolid v-if="showStarred" />
            <IconStarOutline v-else />
        </ToolButton>
        <ToolButton class="w-8 h-8" v-if="hasImages" @click="toggleImages">
            <IconImageSolid v-if="showImages" />
            <IconImageOutline v-else />
        </ToolButton>
        <ToolButton class="w-8 h-8" @click="clear" :disabled="!hasClips">
            <IconTrash />
        </ToolButton>
    </div>
</template>
