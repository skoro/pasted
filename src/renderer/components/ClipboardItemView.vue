<script setup>
import ToolButton from './ToolButton.vue'
import IconDotsHorizontal from './icons/IconDotsHorizontal.vue'
import IconFavoriteOutline from './icons/IconFavoriteOutline.vue'
import IconFavoriteSolid from './icons/IconFavoriteSolid.vue'
import Clip from '../stores/clip-entity'

defineEmits([
    'switch-view',
    'toggle-favorite',
    'copy-item',
])

const props = defineProps({
    clip: {
        type: Clip,
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
        <ToolButton @click="$emit('toggle-favorite')">
            <IconFavoriteSolid v-if="clip.favorite" />
            <IconFavoriteOutline v-else />
        </ToolButton>
    </div>
</template>
