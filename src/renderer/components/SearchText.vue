<script setup>
import { ref, onMounted } from 'vue';
import Mousetrap from 'mousetrap';
import { useClipboardStore } from '../stores/useClipboardStore';
import { keyboard } from '../keyshortcuts';

const clipboardStore = useClipboardStore()
const searchInput = ref(null)

const focus = () => {
    if (searchInput.value) {
        searchInput.value.focus()
    }
}

onMounted(() => {
    Mousetrap.bind(keyboard.search, focus);
})
</script>

<template>
    <input type="text"
        class="w-5/6 sm:w-1/2 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none text-sm text-slate-900 placeholder-slate-400 rounded-md py-1 px-2 ring-1 ring-slate-200 shadow-sm"
        v-model="clipboardStore.filter"
        ref="searchInput"
        placeholder="Press Ctrl-K to search..."
    />
</template>
