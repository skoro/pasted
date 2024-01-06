<script setup>
import { ref } from 'vue';
import Mousetrap from 'mousetrap';
import { useClipboardStore } from '../stores/useClipboardStore';
import keyboard from '../keyshortcuts';

const clipboardStore = useClipboardStore()
const searchInput = ref(null)

const focus = () => {
    if (searchInput.value) {
        searchInput.value.focus()
    }
}

Mousetrap.bind(keyboard.search, focus);
</script>

<template>
    <input type="text"
        class="w-full rounded-lg  bg-slate-100 focus:bg-slate-50 p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-300"
        v-model="clipboardStore.filter"
        ref="searchInput"
        placeholder="Type here to search..."
    />
</template>
