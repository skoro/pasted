<script setup>
import { computed } from 'vue';
import ToolButton from './ToolButton.vue';
import IconTrash from './icons/IconTrash.vue';
import { useClipboardStore } from '../stores/useClipboardStore';

const clipboardStore = useClipboardStore()

const hasClips = computed(() => clipboardStore.clips.length > 0)

function clear() {
    if (hasClips.value && confirm('Are you sure you want to clear ?')) {
        clipboardStore.clear()
        window.electronAPI.clearList()
    }
}
</script>

<template>
    <div class="fixed flex h-10 bg-gray-300 w-full bottom-0 left-0 justify-start items-center px-2 py-2">
        <ToolButton class="w-6 h-6" @click="clear" :disabled="hasClips">
            <IconTrash />
        </ToolButton>
    </div>
</template>
