<script setup>
import { computed } from 'vue'
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

const formatted = computed(() => {
    return props.clip.data.substring(0, 199).trimStart()
})
</script>

<template>
    <div class="flex-1 overflow-hidden">
        <a href="#" @click.prevent="$emit('copy-item')">
            <img class="object-scale-down h-20" v-if="clip.image" :src="clip.data"/>
            <pre v-else>{{ formatted }}</pre>
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
