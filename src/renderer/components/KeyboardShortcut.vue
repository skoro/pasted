<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    keys: {
        type: String,
        required: true,
    }
})
</script>

<template>
    <div>
        <span class="pr-2">{{ label }}:</span>
        <span class="bg-slate-200 rounded py-1 px-2 text-slate-400 font-medium">{{ keys }}</span>
    </div>
</template>