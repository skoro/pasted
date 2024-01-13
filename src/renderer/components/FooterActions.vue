<script setup>
import { ref, computed, onMounted } from 'vue';
import Mousetrap from 'mousetrap';
import ToolButton from './ToolButton.vue';
import IconTrash from './icons/IconTrash.vue';
import IconFavoriteOutline from './icons/IconFavoriteOutline.vue';
import IconFavoriteSolid from './icons/IconFavoriteSolid.vue';
import { useClipboardStore } from '../stores/useClipboardStore';
import keyboard from '../keyshortcuts';

const clipboardStore = useClipboardStore()

const hasClips = computed(() => clipboardStore.clips.length > 0)

const showFavs = ref(false)

onMounted(() => Mousetrap.bind(keyboard.toggleFavorites, toggleFavorites))

function clear() {
    if (hasClips.value && confirm('Are you sure you want to clear ?')) {
        clipboardStore.clear()
        window.electronAPI.clearList()
    }
}

function toggleFavorites() {
    showFavs.value = !showFavs.value
    clipboardStore.favorites = showFavs.value
}
</script>

<template>
    <div class="fixed flex flex-row bottom-0 left-0 h-11 w-full bg-gray-200 space-x-4 justify-center items-center text-gray-600">
        <ToolButton class="w-8 h-8" @click="toggleFavorites">
            <IconFavoriteSolid v-if="showFavs" />
            <IconFavoriteOutline v-else />
        </ToolButton>
        <ToolButton class="w-8 h-8" @click="clear" :disabled="!hasClips">
            <IconTrash />
        </ToolButton>
    </div>
</template>
