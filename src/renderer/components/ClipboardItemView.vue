<script setup>
import ToolButton from './ToolButton.vue'
import IconDotsHorizontal from './icons/IconDotsHorizontal.vue'
import IconStarOutline from './icons/IconStarOutline.vue'
import IconStarSolid from './icons/IconStarSolid.vue'

defineEmits([
    'switch-view',
    'toggle-starred',
    'copy-item',
    'remove-item',
])

const props = defineProps({
    clip: {
        type: Object,
        required: true,
    }
})
</script>

<template>
    <div class="flex-1 overflow-hidden">
        <a href="#" @click="$emit('copy-item')">
            {{ clip.data }}
        </a>
    </div>
    <div class="flex flex-col text-slate-800 w-6 space-y-4 p-1">
        <ToolButton @click="$emit('switch-view', 'menu')">
            <IconDotsHorizontal />
        </ToolButton>
        <ToolButton @click="$emit('toggle-starred')">
            <IconStarSolid v-if="clip.starred" />
            <IconStarOutline v-else />
        </ToolButton>
    </div>
</template>
