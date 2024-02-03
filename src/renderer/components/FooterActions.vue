<script setup>
import { ref, watch, computed, onMounted } from 'vue';
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

const starred = ref(false)
const images = ref(false)

watch(starred, (newStarred) => clipboardStore.onlyStarred = newStarred)
watch(images, (newImages) => clipboardStore.withImages = newImages && hasImages.value)

onMounted(() => {
    Mousetrap.bind(keyboard.toggleStarred, () => starred.value = !starred.value)
    Mousetrap.bind(keyboard.toggleImages, () => images.value = !images.value)
    Mousetrap.bind(keyboard.removeItems, clear)
})

function clear() {
    if (!hasClips.value) {
        return false
    }

    let msg
    let clearCallback

    if (starred.value && images.value) {
        msg = 'Are you sure you want to remove starred images ?'
        clearCallback = (item) => item.starred && item.image
    } else if (starred.value) {
        msg = 'Are you sure you want to remove starred items ?'
        clearCallback = (item) => item.starred
    } else if (images.value) {
        msg = 'Are you sure you want to remove images ?'
        clearCallback = (item) => item.image && !item.starred
    } else {
        msg = 'Are you sure you want to remove items ?'
        clearCallback = (item) => !item.starred
    }

    if (confirm(msg)) {
        clipboardStore.clear(clearCallback)
        window.electronAPI.clearList()
        if (showStarred.value && !hasClips.value) {
            starred.value = true
        }
    }
}
</script>

<template>
    <div
        class="fixed flex flex-row bottom-0 left-0 h-11 w-full bg-gray-200 space-x-4 justify-center items-center text-gray-600">
        <ToolButton class="w-8 h-8" @click="starred = !starred">
            <IconStarSolid v-if="starred" />
            <IconStarOutline v-else />
        </ToolButton>
        <ToolButton class="w-8 h-8" v-if="hasImages" @click="images = !images">
            <IconImageSolid v-if="images" />
            <IconImageOutline v-else />
        </ToolButton>
        <ToolButton class="w-8 h-8" @click="clear">
            <IconTrash />
        </ToolButton>
    </div>
</template>
