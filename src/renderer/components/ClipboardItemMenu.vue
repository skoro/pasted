<script setup>
import ToolButton from './forms/ToolButton.vue'
import IconBack from './icons/IconBack.vue'
import IconCopy from './icons/IconCopy.vue'
import IconTrash from './icons/IconTrash.vue'
import IconSearch from './icons/IconSearch.vue'

defineEmits([
    'switch-view',
    'copy-item',
    'remove-item',
    'peek-item',
])
</script>

<template>
    <div class="flex flex-row space-x-3 text-slate-600">
        <ToolButton class="h-8 w-8" @click="$emit('switch-view', 'view')">
            <IconBack />
        </ToolButton>
        <ToolButton class="h-8 w-8" @click="$emit('copy-item')">
            <IconCopy />
        </ToolButton>
        <ToolButton class="h-8 w-8" @click="$emit('peek-item')">
            <IconSearch />
        </ToolButton>
        <ToolButton class="h-8 w-8" @click="$emit('remove-item')">
            <IconTrash />
        </ToolButton>
    </div>
</template>
