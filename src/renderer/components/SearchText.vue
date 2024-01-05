<script setup>
import { useClipboardStore } from '../stores/useClipboardStore';

const clipboardStore = useClipboardStore()
</script>

<template>
    <input type="text"
        class="w-full rounded-lg  bg-slate-100 focus:bg-slate-50 p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-300"
        v-model="clipboardStore.filter"
        placeholder="Type here to search..." />
</template>
